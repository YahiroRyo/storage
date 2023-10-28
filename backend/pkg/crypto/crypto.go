package crypto

import (
	"github.com/samber/lo"
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (*string, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		return nil, err
	}
	return lo.ToPtr(string(hashed)), err
}

func CompPassword(hashedPassword string, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	return err == nil
}
