package migration

import (
	"fmt"
	"os"

	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
)

func Run() {
	if err := os.Mkdir("../../db", 0777); err != nil {
		panic(err)
	}
	path := "../../db/__main.db"

	db, err := sqlx.Connect("sqlite3", path)
	if err != nil {
		panic(err)
	}
	fmt.Printf("===== RUN MIGRATE =====\n")

	migrations := []Migration{
		NewMasterMigration(),
		NewUserTableMigration(),
		NewFileTableMigration(),
	}
	for _, m := range migrations {
		if existsID(*db, m.ID()) {
			continue
		}
		m.Up(*db)
		insertMigratedToMigrations(*db, m.ID())
		fmt.Printf("migrate up: %s\n", m.ID())
	}

	fmt.Printf("===== DONE MIGRATE =====\n")
}

type Migration interface {
	ID() string
	Up(db sqlx.DB)
	Down(db sqlx.DB)
}

type MasterMigration struct{}

func NewMasterMigration() MasterMigration {
	return MasterMigration{}
}

func (m MasterMigration) ID() string {
	return "master_migration"
}

func (m MasterMigration) Up(db sqlx.DB) {
	q := `
	CREATE TABLE IF NOT EXISTS migrations (
		id TEXT PRIMARY KEY,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	)`
	if _, err := db.Exec(q); err != nil {
		panic(err)
	}
}

func (m MasterMigration) Down(db sqlx.DB) {
	q := `DROP TABLE migrations`
	if _, err := db.Exec(q); err != nil {
		panic(err)
	}
}

func existsID(db sqlx.DB, id string) bool {
	fields := struct {
		ID *string `db:"id"`
	}{}
	q := `
	SELECT
		id
	FROM
		migrations
	WHERE
		id = ?`
	if err := db.Get(&fields, q, id); err != nil {
		return false
	}
	return fields.ID != nil
}

func insertMigratedToMigrations(db sqlx.DB, id string) {
	q := `
	INSERT INTO migrations (
		id
	) VALUES (?)`
	if _, err := db.Exec(q, id); err != nil {
		panic(err)
	}
}
