package response

import (
	"errors"
	"strconv"

	"github.com/labstack/echo/v4"
)

func Json(ctx echo.Context, status int, body any) error {
	ctx.JSON(status, body)
	return errors.New(strconv.Itoa(status))
}
