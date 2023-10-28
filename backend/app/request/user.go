package request

import (
	"github.com/YahiroRyo/storage/backend/app/model"
	"github.com/YahiroRyo/storage/backend/openapi"
	"github.com/YahiroRyo/storage/backend/pkg/crypto"
)

type CreateUserReq struct {
	openapi.CreateUserReq
}

func (req CreateUserReq) ToModel(id string, rememberToken string) (*model.User, error) {
	hashedPassword, err := crypto.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	return &model.User{
		ID:            id,
		Email:         string(req.Email),
		Password:      *hashedPassword,
		Username:      req.Username,
		RememberToken: rememberToken,
	}, nil
}

type LoginReq struct {
	openapi.LoginReq
}

func (req LoginReq) ToModel(id string, rememberToken string) (*model.User, error) {
	hashedPassword, err := crypto.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	return &model.User{
		ID:            id,
		Email:         string(req.Email),
		Password:      *hashedPassword,
		Username:      "",
		RememberToken: rememberToken,
	}, nil
}
