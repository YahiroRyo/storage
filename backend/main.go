package main

import (
	"github.com/YahiroRyo/storage/backend/context/common"
	commonService "github.com/YahiroRyo/storage/backend/context/common/service"
	oapi "github.com/YahiroRyo/storage/backend/openapi"
	oapiMiddleware "github.com/deepmap/oapi-codegen/pkg/middleware"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()

	swagger, err := oapi.GetSwagger()
	if err != nil {
		panic(err)
	}

	e.Use(oapiMiddleware.OapiRequestValidator(swagger))
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	server := NewServer()
	oapi.RegisterHandlers(e, &server)

	e.Logger.Fatal(e.Start(":8080"))
}

type Server struct {
	common.CommonService
}

func NewServer() Server {
	return Server{
		commonService.NewCommonService(),
	}
}
