package model

import "time"

type User struct {
	ID            string    `db:"u_id"`
	Email         string    `db:"u_email"`
	Password      string    `db:"u_password"`
	Username      string    `db:"u_username"`
	RememberToken string    `db:"u_remember_token"`
	CreatedAt     time.Time `db:"f_created_at"`
	UpdatedAt     time.Time `db:"f_updated_at"`
}
