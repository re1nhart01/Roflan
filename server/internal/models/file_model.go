package models

import "fmt"

type FileModel struct {
	*BaseModel
	FileName      string `json:"file_name"`
	OwnerUserHash string `json:"owner_user_hash"`
	BucketId      string `json:"bucket_id"`
}

func (m *Models) NewFileTable() string {
	return fmt.Sprintf(`
		CREATE TABLE IF NOT EXISTS %s (
	    %s
		file_name VARCHAR(250) NOT NULL,
		owner_user_hash VARCHAR(500) NOT NULL REFERENCES %s(user_hash) ON DELETE CASCADE,
		bucket_id VARCHAR(500) NOT NULL
		)
`, FilesTable, NewBaseModels(), UsersTable)
}
