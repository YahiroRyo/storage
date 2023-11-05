package main

import (
	"context"
	"errors"
	"os"
	"strings"

	"github.com/YahiroRyo/storage/backend/app/handler"
	"github.com/YahiroRyo/storage/backend/app/model"
	"github.com/YahiroRyo/storage/backend/migration"
	oapi "github.com/YahiroRyo/storage/backend/openapi"
	oapiMiddleware "github.com/deepmap/oapi-codegen/pkg/middleware"
	"github.com/getkin/kin-openapi/openapi3filter"
	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	if len(os.Args) >= 2 {
		if os.Args[1] == "migrate" {
			migration.Run()
			return
		}
	}
	runEcho()
}

func runEcho() {
	e := echo.New()

	swagger, err := oapi.GetSwagger()
	if err != nil {
		panic(err)
	}

	db, err := connectToDB()
	if err != nil {
		panic(err)
	}

	initRegisterBodyDecoder()

	validatorOpts := &oapiMiddleware.Options{}
	validatorOpts.Options.AuthenticationFunc = func(ctx context.Context, input *openapi3filter.AuthenticationInput) error {
		k := input.RequestValidationInput.Request.Header.Get("Authorization")
		splitedk := strings.Split(k, " ")
		if len(splitedk) <= 1 {
			return errors.New("authentication failed")
		}

		token := splitedk[1]

		var user model.User
		q := `
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
		if err := db.GetContext(ctx, &user, q, token); err != nil {
			return err
		}

		return nil
	}

	e.Use(oapiMiddleware.OapiRequestValidatorWithOptions(swagger, validatorOpts))
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(echoMiddleware.CORSWithConfig(echoMiddleware.CORSConfig{
		AllowOriginFunc: func(origin string) (bool, error) {
			return true, nil
		},
		AllowCredentials: true,
	}))

	c, err := handler.New(context.TODO(), *db)
	if err != nil {
		panic(err)
	}

	oapi.RegisterHandlers(e, c)

	e.Logger.Fatal(e.Start(":8080"))
}

func connectToDB() (*sqlx.DB, error) {
	if err := os.Mkdir("../../db", 0777); err != nil {
		panic(err)
	}
	path := "../../db/__main.db"

	db, err := sqlx.Connect("sqlite3", path)
	if err != nil {
		return nil, err
	}

	return db, err
}

func initRegisterBodyDecoder() {
	contentTypes := []string{
		"text/html; charset=utf-8",
		"text/plain; charset=utf-8",
		"text/xml; charset=utf-8",
		"text/plain; charset=utf-16be",
		"text/plain; charset=utf-16le",
		"text/plain; charset=utf-8",
		"image/x-icon",
		"image/x-icon",
		"image/bmp",
		"image/gif",
		"image/webp",
		"image/png",
		"image/jpeg",
		"audio/basic",
		"audio/aiff",
		"audio/mpeg",
		"application/ogg",
		"audio/midi",
		"audio/wave",
		"video/avi",
		"video/mp4",
		"video/webm",
		"font/ttf",
		"font/otf",
		"font/collection",
		"font/woff",
		"font/woff2",
		"application/pdf",
		"application/postscript",
		"application/x-gzip",
		"application/zip",
		"application/x-rar-compressed",
		"application/x-rar-compressed",
		"application/wasm",
		"application/vnd.ms-fontobject",
		"application/octet-stream",
	}

	for _, ct := range contentTypes {
		openapi3filter.RegisterBodyDecoder(ct, openapi3filter.FileBodyDecoder)
	}
}
