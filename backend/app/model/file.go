package model

import (
	"database/sql"
	"time"
)

const DIRECTORY = "DIR"

type File struct {
	ID          string         `db:"f_id"`
	Owner       string         `db:"f_owner"`
	DirectoryId sql.NullString `db:"f_directory_id"`
	Mimetype    string         `db:"f_mimetype"`
	Name        string         `db:"f_name"`
	URL         sql.NullString `db:"f_url"`
	CreatedAt   time.Time      `db:"f_created_at"`
	UpdatedAt   time.Time      `db:"f_updated_at"`
}

func (f *File) Update(name string, directoryId *string) {
	f.Name = name
	if directoryId != nil && *directoryId != "" {
		f.DirectoryId = sql.NullString{
			Valid:  true,
			String: *directoryId,
		}
	}
}

func NewFile(
	id string,
	owner string,
	directoryId *string,
	mimetype string,
	name string,
	url *string,
	createdAt time.Time,
	updatedAt time.Time,
) File {
	sqlObjDirectoryId := sql.NullString{
		Valid: false,
	}
	sqlObjUrl := sql.NullString{
		Valid: false,
	}
	if directoryId != nil {
		sqlObjDirectoryId = sql.NullString{
			Valid:  true,
			String: *directoryId,
		}
	}
	if url != nil {
		sqlObjUrl = sql.NullString{
			Valid:  true,
			String: *url,
		}
	}

	return File{
		ID:          id,
		Owner:       owner,
		DirectoryId: sqlObjDirectoryId,
		Name:        name,
		Mimetype:    mimetype,
		URL:         sqlObjUrl,
	}
}
