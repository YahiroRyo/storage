package migration

import "github.com/jmoiron/sqlx"

type AlterTableFilesMigration struct {
}

func NewAlterTableFilesMigration() AlterTableFilesMigration {
	return AlterTableFilesMigration{}
}

func (f AlterTableFilesMigration) ID() string {
	return "alter_table_files_migration"
}

func (f AlterTableFilesMigration) Up(db sqlx.DB) {
	q := `
	ALTER TABLE files ADD is_publish INTEGER DEFAULT 0`
	if _, err := db.Exec(q); err != nil {
		panic(err)
	}
}

func (f AlterTableFilesMigration) Down(db sqlx.DB) {
	q := `ALTER TABLE files DROP COLUMN is_publish`
	if _, err := db.Exec(q); err != nil {
		panic(err)
	}
}
