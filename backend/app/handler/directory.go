package handler

import (
	"net/http"
	"strings"

	"github.com/YahiroRyo/storage/backend/app/model"
	"github.com/YahiroRyo/storage/backend/openapi"
	"github.com/YahiroRyo/storage/backend/pkg/identify"
	"github.com/YahiroRyo/storage/backend/pkg/response"
	"github.com/labstack/echo/v4"
)

func (h *Handler) PostDirectory(ctx echo.Context) error {
	var req *openapi.CreateDirectoryReq
	if err := ctx.Bind(&req); err != nil {
		return response.Json(ctx, http.StatusBadRequest, err.Error())
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
		remember_token = ?
	`
	if err := h.db.GetContext(ctx.Request().Context(), &user, q, splitedAuthorization[1]); err != nil {
		return response.Json(ctx, http.StatusBadRequest, openapi.UnauthorizedError{Message: "authorization is uncorrect"})
	}

	file := model.File{
		ID:          identify.Generate(),
		Owner:       user.ID,
		DirectoryId: req.DirectoryId,
		Name:        req.Name,
		Mimetype:    model.DIRECTORY,
		URL:         nil,
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
	return response.Json(ctx, http.StatusOK, openapi.CreateDirectoryRes{Id: file.ID})
}
