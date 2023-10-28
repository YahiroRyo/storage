package handler

import (
	"context"
	"os"

	"github.com/YahiroRyo/storage/backend/aws"
	"github.com/jmoiron/sqlx"
)

type Handler struct {
	db     sqlx.DB
	helper aws.Helper
}

func New(ctx context.Context, db sqlx.DB) (*Handler, error) {
	helper, err := aws.New(
		ctx,
		os.Getenv("CF_REGION"),
		os.Getenv("CF_ACCOUNT_ID"),
		os.Getenv("CF_ACCESS_KEY_ID"),
		os.Getenv("CF_ACCESS_KEY_SECRET"),
	)
	if err != nil {
		return nil, err
	}

	return &Handler{
		db,
		*helper,
	}, nil
}
