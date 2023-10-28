package model

import "time"

const DIRECTORY = "DIR"

type File struct {
	ID          string    `db:"f_id"`
	Owner       string    `db:"f_owner"`
	DirectoryId *string   `db:"f_directory_id"`
	Mimetype    string    `db:"f_mimetype"`
	Name        string    `db:"f_name"`
	URL         *string   `db:"f_url"`
	CreatedAt   time.Time `db:"f_created_at"`
	UpdatedAt   time.Time `db:"f_updated_at"`
}

func (f *File) Update(name string) {
	f.Name = name
}
