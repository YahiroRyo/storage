package handler

import (
	"github.com/YahiroRyo/storage/backend/openapi"
	"github.com/labstack/echo/v4"
)

func (h *Handler) GetHealth(ctx echo.Context) error {
	ctx.JSON(200, openapi.HealthRes{
		Message: "ok",
	})
	return nil
}
