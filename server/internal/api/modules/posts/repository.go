package api

import "github.com/roflan.io/api/base"

type PostsRepository struct {
	*base.Repository
}

func NewPostsRepository() *PostsRepository {
	return &PostsRepository{
		&base.Repository{TableName: "posts"},
	}
}
