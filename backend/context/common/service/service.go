package service

import (
	"github.com/YahiroRyo/storage/backend/openapi"
	"github.com/labstack/echo/v4"
)

type CommonService struct {
}

func NewCommonService() CommonService {
	return CommonService{}
}

func (cs CommonService) GetHealth(ctx echo.Context) error {
	r := openapi.HealthRes{
		Message: "ok",
	}
	ctx.JSON(200, r)

	return nil
}
