package models

import "fmt"

type PostsModel struct {
	*BaseModel
	UserHashId  string `json:"user_hash_id"`
	ContentText string `json:"content_text"`
	PostId      string `json:"post_id"`
}

type PostsModelFull struct {
	*BaseModel
	UserHashId  string                 `json:"user_hash_id"`
	ContentText string                 `json:"content_text"`
	PostId      string                 `json:"post_id"`
	Files       []*PostsFilesFullModel `json:"files,omitempty"`
}

func (m *Models) NewPostsTable() string {
	return fmt.Sprintf(`
		CREATE TABLE IF NOT EXISTS %s (
	    %s
		user_hash_id VARCHAR(250) NOT NULL,
		content_text VARCHAR(5000) NOT NULL,
		post_id VARCHAR(500) NOT NULL UNIQUE,
		    UNIQUE(user_hash_id, post_id)
		)
`, PostsTable, NewBaseModels())
}
