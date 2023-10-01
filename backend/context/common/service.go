package common

import "github.com/labstack/echo/v4"

type CommonService interface {
	GetHealth(ctx echo.Context) error
}
