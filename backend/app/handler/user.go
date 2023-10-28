package handler

import (
	"net/http"
	"strings"

	"github.com/YahiroRyo/storage/backend/app/model"
	"github.com/YahiroRyo/storage/backend/app/request"
	"github.com/YahiroRyo/storage/backend/openapi"
	"github.com/YahiroRyo/storage/backend/pkg/crypto"
	"github.com/YahiroRyo/storage/backend/pkg/identify"
	"github.com/YahiroRyo/storage/backend/pkg/response"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func (h *Handler) PostUser(ctx echo.Context) error {
	var req *request.CreateUserReq
	if err := ctx.Bind(&req); err != nil {
		return response.Json(ctx, http.StatusBadRequest, openapi.BadRequestError{Message: err.Error()})
	}
	if req == nil {
		return response.Json(ctx, http.StatusBadRequest, openapi.BadRequestError{Message: "request is not found"})
	}

	var (
		q           string
		userCounter int
	)
	q = `
	SELECT
		COUNT(*)
	FROM
		users
	WHERE
		email = ?`
	err := h.db.QueryRowContext(ctx.Request().Context(), q, req.Email).Scan(&userCounter)
	if err != nil {
		return response.Json(ctx, http.StatusBadRequest, openapi.BadRequestError{Message: err.Error()})
	}
	if userCounter != 0 {
		return response.Json(ctx, http.StatusBadRequest, openapi.BadRequestError{Message: "already registered user"})
	}
	user, err := req.ToModel(identify.Generate(), uuid.NewString())
	if err != nil {
		return response.Json(ctx, http.StatusBadRequest, openapi.BadRequestError{Message: err.Error()})
	}

	q = `
	INSERT INTO users (
		id,
		username,
		email,
		password,
		remember_token
	)
	VALUES (
		:u_id,
		:u_username,
		:u_email,
		:u_password,
		:u_remember_token
	)`
	_, err = h.db.NamedExecContext(ctx.Request().Context(), q, user)
	if err != nil {
		return response.Json(ctx, http.StatusInternalServerError, openapi.InternalError{Message: err.Error()})
	}

	response.Json(ctx, http.StatusOK, openapi.CreateUserRes{
		Token: user.RememberToken,
	})
	return nil
}

func (h *Handler) PostUserLogin(ctx echo.Context) error {
	var req *request.LoginReq
	if err := ctx.Bind(&req); err != nil {
		return response.Json(ctx, http.StatusBadRequest, openapi.BadRequestError{Message: err.Error()})
	}
	if req == nil {
		return response.Json(ctx, http.StatusBadRequest, openapi.BadRequestError{Message: "request is not found"})
	}

	var (
		q    string
		user model.User
	)
	q = `
	SELECT
		id as u_id,
		password as u_password,
		email as u_email,
		username as u_username,
		remember_token as u_remember_token
	FROM
		users
	WHERE
		email = ?
	`
	err := h.db.GetContext(ctx.Request().Context(), &user, q, string(req.Email))
	if err != nil {
		return response.Json(ctx, http.StatusBadRequest, openapi.BadRequestError{Message: err.Error()})
	}

	if !crypto.CompPassword(user.Password, req.Password) {
		return response.Json(ctx, http.StatusUnauthorized, openapi.UnauthorizedError{Message: "failed login"})
	}

	user.RememberToken = uuid.NewString()
	q = `
	UPDATE users SET
		remember_token = :u_remember_token
	WHERE
		id = :u_id
	`
	if _, err = h.db.NamedExecContext(ctx.Request().Context(), q, user); err != nil {
		return response.Json(ctx, http.StatusBadRequest, openapi.BadRequestError{Message: err.Error()})
	}

	return response.Json(ctx, http.StatusOK, openapi.LoginRes{Token: user.RememberToken})
}

func (h *Handler) PostUserLogout(ctx echo.Context) error {
	authorization := ctx.Request().Header.Get("Authorization")
	if authorization == "" {
		return response.Json(ctx, http.StatusBadRequest, openapi.BadRequestError{Message: "required authorization"})
	}

	splitedAuthorization := strings.Split(authorization, " ")
	if len(splitedAuthorization) != 2 {
		return response.Json(ctx, http.StatusBadRequest, openapi.BadRequestError{Message: "required authorization"})
	}

	q := `
	UPDATE users SET
		remember_token = ?
	WHERE
		remember_token = ?
	`
	if _, err := h.db.ExecContext(ctx.Request().Context(), q, "", splitedAuthorization[1]); err != nil {
		return response.Json(ctx, http.StatusBadRequest, openapi.BadRequestError{Message: err.Error()})
	}
	return nil
}
