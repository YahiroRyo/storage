package migration

import "github.com/jmoiron/sqlx"

type UserTableMigration struct {
}

func NewUserTableMigration() UserTableMigration {
	return UserTableMigration{}
}

func (u UserTableMigration) ID() string {
	return "user_table_migration"
}

func (u UserTableMigration) Up(db sqlx.DB) {
	q := `
	CREATE TABLE IF NOT EXISTS users (
		id BIGINT NOT NULL PRIMARY KEY,
		password TEXT NOT NULL,
		email TEXT NOT NULL UNIQUE,
		username TEXT NOT NULL UNIQUE,
		remember_token TEXT,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	)`
	if _, err := db.Exec(q); err != nil {
		panic(err)
	}
}

func (u UserTableMigration) Down(db sqlx.DB) {
	q := `DROP TABLE users`
	if _, err := db.Exec(q); err != nil {
		panic(err)
	}
}
