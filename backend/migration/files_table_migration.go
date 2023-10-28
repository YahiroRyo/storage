package migration

import "github.com/jmoiron/sqlx"

type FileTableMigration struct {
}

func NewFileTableMigration() FileTableMigration {
	return FileTableMigration{}
}

func (f FileTableMigration) ID() string {
	return "file_table_migration"
}

func (f FileTableMigration) Up(db sqlx.DB) {
	q := `
	CREATE TABLE IF NOT EXISTS files (
		id BIGINT NOT NULL PRIMARY KEY,
		owner BIGINT NOT NULL,
		directory_id BIGINT,
		mimetype TEXT NOT NULL,
		url TEXT,
		name TEXT,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	)`
	if _, err := db.Exec(q); err != nil {
		panic(err)
	}
}

func (f FileTableMigration) Down(db sqlx.DB) {
	q := `DROP TABLE files`
	if _, err := db.Exec(q); err != nil {
		panic(err)
	}
}
