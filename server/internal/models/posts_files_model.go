package models

import "fmt"

type PostsFilesModel struct {
	*BaseModel
	PostsPostId     string `json:"posts_post_id"`
	StorageBucketId string `json:"storage_bucket_id"`
	IsMain          bool   `json:"is_main"`
}

type PostsFilesFullModel struct {
	*BaseModel
	*FileModel
	PostsPostId     string `json:"posts_post_id"`
	StorageBucketId string `json:"storage_bucket_id"`
	IsMain          bool   `json:"is_main"`
}

func (m *Models) NewPostsFilesTable() string {
	return fmt.Sprintf(`
		CREATE TABLE IF NOT EXISTS %s (
	    %s
		posts_post_id VARCHAR(250) NOT NULL REFERENCES %s(post_id) ON DELETE CASCADE,
		storage_bucket_id VARCHAR(500) UNIQUE REFERENCES %s(bucket_id) NOT NULL,
		is_main BOOLEAN NOT NULL,
		    UNIQUE(posts_post_id, storage_bucket_id)
		)
`, PostsFilesTable, NewBaseModels(), PostsTable, FilesTable)
}
