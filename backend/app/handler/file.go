package handler

import (
	"bytes"
	"io"
	"net/http"
	"os"
	"strings"

	"github.com/YahiroRyo/storage/backend/app/model"
	"github.com/YahiroRyo/storage/backend/openapi"
	"github.com/YahiroRyo/storage/backend/pkg/identify"
	"github.com/YahiroRyo/storage/backend/pkg/response"
	"github.com/labstack/echo/v4"
	"github.com/samber/lo"
)

func (h *Handler) GetFile(ctx echo.Context) error {
	var req *openapi.FilesReq
	if err := ctx.Bind(&req); err != nil {
		return response.Json(ctx, http.StatusBadRequest, openapi.BadRequestError{Message: err.Error()})
	}
	if req == nil {
		return response.Json(ctx, http.StatusBadRequest, openapi.BadRequestError{Message: "request is not found"})
	}

	if req.DirectoryId == nil {
		var files []model.File
		q := `
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
			directory_id IS NULL`
		if err := h.db.SelectContext(ctx.Request().Context(), &files, q); err != nil {
			return response.Json(ctx, http.StatusInternalServerError, openapi.InternalError{Message: err.Error()})
		}

		res := []openapi.File{}
		for _, f := range files {
			url := ""
			if f.URL != nil {
				url = *f.URL
			}
			res = append(res, openapi.File{
				Id:          f.ID,
				Name:        f.Name,
				Mimetype:    f.Mimetype,
				DirectoryId: f.DirectoryId,
				Url:         url,
				CreatedAt:   f.CreatedAt,
				UpdatedAt:   f.UpdatedAt,
			})
		}
		return response.Json(ctx, http.StatusOK, openapi.FilesRes{
			Files: res,
			Path:  []openapi.File{},
		})
	}

	var files []model.File
	q := `
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
		directory_id = ?`
	if err := h.db.SelectContext(ctx.Request().Context(), &files, q, *req.DirectoryId); err != nil {
		return response.Json(ctx, http.StatusInternalServerError, openapi.InternalError{Message: err.Error()})
	}

	paths := []openapi.File{}
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
		if err := h.db.GetContext(ctx.Request().Context(), &file, q, model.DIRECTORY, dId); err != nil {
			return response.Json(ctx, http.StatusInternalServerError, openapi.InternalError{Message: err.Error()})
		}

		paths = append(paths, openapi.File{
			Id:          file.ID,
			Name:        file.Name,
			Mimetype:    file.Mimetype,
			DirectoryId: file.DirectoryId,
			Url:         "",
			CreatedAt:   file.CreatedAt,
			UpdatedAt:   file.UpdatedAt,
		})
		if file.DirectoryId == nil {
			break
		}

		dId = *file.DirectoryId
	}

	res := []openapi.File{}
	for _, f := range files {
		url := ""
		if f.URL != nil {
			url = *f.URL
		}

		res = append(res, openapi.File{
			Id:          f.ID,
			Name:        f.Name,
			Mimetype:    f.Mimetype,
			DirectoryId: f.DirectoryId,
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
	var directoryId *string
	if v := ctx.FormValue("directory_id"); v != "" {
		directoryId = lo.ToPtr(v)
	}

	f, err := ctx.FormFile("file")
	if err != nil {
		return response.Json(ctx, http.StatusBadRequest, openapi.BadRequestError{Message: err.Error()})
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

	if err != nil {
		return response.Json(ctx, http.StatusBadRequest, openapi.BadRequestError{Message: err.Error()})
	}

	r, err := f.Open()
	if err != nil {
		return response.Json(ctx, http.StatusBadRequest, openapi.BadRequestError{Message: err.Error()})
	}
	defer r.Close()

	buf := bytes.NewBuffer(nil)
	if _, err := io.Copy(buf, r); err != nil {
		return err
	}

	url, err := h.helper.S3.UploadSingleObject(os.Getenv("CF_BUCKET"), identify.Generate(), bytes.NewReader(buf.Bytes()))
	if err != nil {
		return response.Json(ctx, http.StatusInternalServerError, openapi.InternalError{Message: err.Error()})
	}

	mimeType := http.DetectContentType(buf.Bytes())
	file := model.File{
		ID:          identify.Generate(),
		Owner:       user.ID,
		DirectoryId: directoryId,
		Name:        f.Filename,
		Mimetype:    mimeType,
		URL:         url,
	}

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
	file.Update(req.Name)

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
