package http

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/roflan.io/api/base"
)

type IPostsRepo interface {
}

type PostsHttpHandler struct {
	*base.Handler
	IPostsRepo
}

func (posts *PostsHttpHandler) GetHandler(context *gin.Context) {
	//TODO implement me
	panic("implement me")
}

func (posts *PostsHttpHandler) GetSpecificHandler(context *gin.Context) {
	//TODO implement me
	panic("implement me")
}

func (posts *PostsHttpHandler) AddHandler(context *gin.Context) {
	//TODO implement me
	panic("implement me")
}

func (posts *PostsHttpHandler) RemoveHandler(context *gin.Context) {
	//TODO implement me
	panic("implement me")
}

func (posts *PostsHttpHandler) UpdateHandler(context *gin.Context) {
	//TODO implement me
	panic("implement me")
}

func (posts *PostsHttpHandler) GetPath() string {
	return posts.Path
}

func (posts *PostsHttpHandler) GetName() string {
	return posts.Name
}

func NewPostsHandler(basePath string, repo IPostsRepo) *PostsHttpHandler {
	return &PostsHttpHandler{
		&base.Handler{
			Name: POSTS_ROUTER,
			Path: fmt.Sprintf("/%s/posts", basePath),
		},
		repo,
	}
}
