package handler

import (
	"database/sql"
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/YahiroRyo/storage/backend/app/model"
	"github.com/YahiroRyo/storage/backend/openapi"
	"github.com/YahiroRyo/storage/backend/pkg/identify"
	"github.com/YahiroRyo/storage/backend/pkg/response"
	"github.com/labstack/echo/v4"
	"github.com/samber/lo"
)

func (h *Handler) GetFileId(ctx echo.Context, id string) error {
	authorization := ctx.Request().Header.Get("Authorization")

	if authorization == "" {
		return response.Json(ctx, http.StatusBadRequest, openapi.BadRequestError{Message: "required authorization"})
	}
	splitedAuthorization := strings.Split(authorization, " ")
	if len(splitedAuthorization) != 2 {
		return response.Json(ctx, http.StatusBadRequest, openapi.BadRequestError{Message: "required authorization"})
	}

	var (
		user model.User
		q    string
	)
	q = `
	SELECT
		id as u_id,
		email as u_email,
		password as u_password,
		username as u_username,
		remember_token as u_remember_token
	FROM
		users
	WHERE
		remember_token = ?`
	if err := h.db.GetContext(ctx.Request().Context(), &user, q, splitedAuthorization[1]); err != nil {
		return response.Json(ctx, http.StatusBadRequest, openapi.UnauthorizedError{Message: "authorization is uncorrect"})
	}

	var file model.File
	q = `
	SELECT
		id as f_id,
		owner as f_owner,
		directory_id as f_directory_id,
		mimetype as f_mimetype,
		name as f_name,
		url as f_url,
		created_at as f_created_at,
		updated_at as f_updated_at
	FROM
		files
	WHERE
		id = ?
	AND
		owner = ?`
	if err := h.db.GetContext(ctx.Request().Context(), &file, q, id, user.ID); err != nil {
		return response.Json(ctx, http.StatusInternalServerError, openapi.InternalError{Message: err.Error()})
	}

	var directoryId *string
	url := ""

	if file.DirectoryId.Valid {
		directoryId = &file.DirectoryId.String
	}
	if file.URL.Valid {
		url = file.URL.String
	}

	return response.Json(ctx, http.StatusOK, openapi.FileObject{
		Id:          file.ID,
		Name:        file.Name,
		Mimetype:    file.Mimetype,
		DirectoryId: directoryId,
		Url:         url,
		CreatedAt:   file.CreatedAt,
		UpdatedAt:   file.UpdatedAt,
	})
}

func (h *Handler) GetFile(ctx echo.Context) error {
	var req *openapi.FilesReq
	if err := ctx.Bind(&req); err != nil {
		return response.Json(ctx, http.StatusBadRequest, openapi.BadRequestError{Message: err.Error()})
	}
	if req == nil {
		return response.Json(ctx, http.StatusBadRequest, openapi.BadRequestError{Message: "request is not found"})
	}
	authorization := ctx.Request().Header.Get("Authorization")

	if authorization == "" {
		return response.Json(ctx, http.StatusBadRequest, openapi.BadRequestError{Message: "required authorization"})
	}
	splitedAuthorization := strings.Split(authorization, " ")
	if len(splitedAuthorization) != 2 {
		return response.Json(ctx, http.StatusBadRequest, openapi.BadRequestError{Message: "required authorization"})
	}

	var (
		user model.User
		q    string
	)
	q = `
	SELECT
		id as u_id,
		email as u_email,
		password as u_password,
		username as u_username,
		remember_token as u_remember_token
	FROM
		users
	WHERE
		remember_token = ?`
	if err := h.db.GetContext(ctx.Request().Context(), &user, q, splitedAuthorization[1]); err != nil {
		return response.Json(ctx, http.StatusBadRequest, openapi.UnauthorizedError{Message: "authorization is uncorrect"})
	}

	if req.DirectoryId == nil {
		var files []model.File
		q = `
		SELECT
			id as f_id,
			owner as f_owner,
			directory_id as f_directory_id,
			mimetype as f_mimetype,
			name as f_name,
			url as f_url,
			created_at as f_created_at,
			updated_at as f_updated_at
		FROM
			files
		WHERE
		(
			directory_id IS NULL
			OR
			directory_id = ""
		)
		AND
			owner = ?`
		if err := h.db.SelectContext(ctx.Request().Context(), &files, q, user.ID); err != nil {
			return response.Json(ctx, http.StatusInternalServerError, openapi.InternalError{Message: err.Error()})
		}

		res := []openapi.FileObject{}
		for _, f := range files {
			var directoryId *string
			url := ""

			if f.DirectoryId.Valid {
				directoryId = &f.DirectoryId.String
			}
			if f.URL.Valid {
				url = f.URL.String
			}

			res = append(res, openapi.FileObject{
				Id:          f.ID,
				Name:        f.Name,
				Mimetype:    f.Mimetype,
				DirectoryId: directoryId,
				Url:         url,
				CreatedAt:   f.CreatedAt,
				UpdatedAt:   f.UpdatedAt,
			})
		}
		return response.Json(ctx, http.StatusOK, openapi.FilesRes{
			Files: res,
			Path:  []openapi.FileObject{},
		})
	}

	var files []model.File
	q = `
	SELECT
		id as f_id,
		owner as f_owner,
		directory_id as f_directory_id,
		mimetype as f_mimetype,
		name as f_name,
		url as f_url,
		created_at as f_created_at,
		updated_at as f_updated_at
	FROM
		files
	WHERE
		directory_id = ?
	AND
		owner = ?`

	if err := h.db.SelectContext(ctx.Request().Context(), &files, q, *req.DirectoryId, user.ID); err != nil {
		return response.Json(ctx, http.StatusInternalServerError, openapi.InternalError{Message: err.Error()})
	}

	paths := []openapi.FileObject{}
	dId := *req.DirectoryId

	for {
		q = `
		SELECT
			id as f_id,
			owner as f_owner,
			directory_id as f_directory_id,
			mimetype as f_mimetype,
			name as f_name,
			url as f_url,
			created_at as f_created_at,
			updated_at as f_updated_at
		FROM
			files
		WHERE
			mimetype = ?
		AND
			id = ?`
		var file model.File
		err := h.db.GetContext(ctx.Request().Context(), &file, q, model.DIRECTORY, dId)
		if err != nil && !errors.Is(err, sql.ErrNoRows) {
			return response.Json(ctx, http.StatusInternalServerError, openapi.InternalError{Message: err.Error()})
		}

		var directoryId *string
		if file.DirectoryId.Valid {
			directoryId = &file.DirectoryId.String
		}

		paths = append(paths, openapi.FileObject{
			Id:          file.ID,
			Name:        file.Name,
			Mimetype:    file.Mimetype,
			DirectoryId: directoryId,
			Url:         "",
			CreatedAt:   file.CreatedAt,
			UpdatedAt:   file.UpdatedAt,
		})

		if directoryId == nil {
			break
		}

		dId = *directoryId
	}

	res := []openapi.FileObject{}

	for _, f := range files {
		var directoryId *string
		url := ""

		if f.DirectoryId.Valid {
			directoryId = &f.DirectoryId.String
		}
		if f.URL.Valid {
			url = f.URL.String
		}

		res = append(res, openapi.FileObject{
			Id:          f.ID,
			Name:        f.Name,
			Mimetype:    f.Mimetype,
			DirectoryId: directoryId,
			Url:         url,
			CreatedAt:   f.CreatedAt,
			UpdatedAt:   f.UpdatedAt,
		})
	}
	return response.Json(ctx, http.StatusOK, openapi.FilesRes{
		Files: res,
		Path:  lo.Reverse(paths),
	})
}

func (h *Handler) PostFile(ctx echo.Context) error {
	var req *openapi.UploadFileReq
	if err := ctx.Bind(&req); err != nil {
		return response.Json(ctx, http.StatusBadRequest, openapi.BadRequestError{Message: err.Error()})
	}
	if req == nil {
		return response.Json(ctx, http.StatusBadRequest, openapi.BadRequestError{Message: "request is not found"})
	}

	authorization := ctx.Request().Header.Get("Authorization")

	if authorization == "" {
		return response.Json(ctx, http.StatusBadRequest, openapi.UnauthorizedError{Message: "required authorization"})
	}
	splitedAuthorization := strings.Split(authorization, " ")
	if len(splitedAuthorization) != 2 {
		return response.Json(ctx, http.StatusBadRequest, openapi.UnauthorizedError{Message: "required authorization"})
	}

	var (
		user model.User
		q    string
	)
	q = `
	SELECT
		id as u_id,
		email as u_email,
		password as u_password,
		username as u_username,
		remember_token as u_remember_token
	FROM
		users
	WHERE
		remember_token = ?`
	if err := h.db.GetContext(ctx.Request().Context(), &user, q, splitedAuthorization[1]); err != nil {
		return response.Json(ctx, http.StatusBadRequest, openapi.UnauthorizedError{Message: "authorization is uncorrect"})
	}

	file := model.NewFile(
		identify.Generate(),
		user.ID,
		req.DirectoryId,
		req.Mimetype,
		req.Filename,
		&req.Url,
		time.Now(),
		time.Now(),
	)

	q = `
	INSERT INTO files (
		id,
		owner,
		directory_id,
		mimetype,
		url,
		name
	)
	VALUES (
		:f_id,
		:f_owner,
		:f_directory_id,
		:f_mimetype,
		:f_url,
		:f_name
	)`

	if _, err := h.db.NamedExecContext(ctx.Request().Context(), q, file); err != nil {
		return response.Json(ctx, http.StatusInternalServerError, openapi.InternalError{Message: err.Error()})
	}

	return response.Json(ctx, http.StatusOK, openapi.UploadFileRes{Id: file.ID})
}

func (h *Handler) PutFile(ctx echo.Context) error {
	var req *openapi.UpdateFileReq
	if err := ctx.Bind(&req); err != nil {
		return response.Json(ctx, http.StatusBadRequest, err.Error())
	}
	if req == nil {
		return response.Json(ctx, http.StatusBadRequest, openapi.BadRequestError{Message: "request is not found"})
	}

	var file model.File
	q := `
	SELECT
		id as f_id,
		owner as f_owner,
		directory_id as f_directory_id,
		mimetype as f_mimetype,
		name as f_name,
		created_at as f_created_at,
		updated_at as f_updated_at
	FROM
		files
	WHERE
		f_id = ?`
	if err := h.db.GetContext(ctx.Request().Context(), &file, q, req.Id); err != nil {
		return response.Json(ctx, http.StatusInternalServerError, openapi.InternalError{Message: err.Error()})
	}
	file.Update(req.Name, req.DirectoryId)

	q = `
	UPDATE files SET
		name = :f_name
	WHERE
		id = :f_id`
	if _, err := h.db.NamedExecContext(ctx.Request().Context(), q, file); err != nil {
		return response.Json(ctx, http.StatusInternalServerError, openapi.InternalError{Message: err.Error()})
	}

	return response.Json(ctx, http.StatusOK, openapi.UpdateFileRes{Message: "ok"})
}

func (h *Handler) DeleteFile(ctx echo.Context) error {
	var req *openapi.DeleteFileReq
	if err := ctx.Bind(&req); err != nil {
		return response.Json(ctx, http.StatusBadRequest, err.Error())
	}
	if req == nil {
		return response.Json(ctx, http.StatusBadRequest, openapi.BadRequestError{Message: "request is not found"})
	}

	q := `
	DELETE
		FROM files
	WHERE
		id = ?`
	if _, err := h.db.ExecContext(ctx.Request().Context(), q, req.Id); err != nil {
		return response.Json(ctx, http.StatusBadRequest, err.Error())
	}

	return response.Json(ctx, http.StatusOK, openapi.DeleteFileReq{Id: req.Id})
}
