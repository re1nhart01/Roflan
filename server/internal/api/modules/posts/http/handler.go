package http

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/roflan.io/api/base"
	"github.com/roflan.io/helpers"
	"github.com/roflan.io/paginator"
)

type IPostsRepo interface {
	AddPost(userHash, contentText string, filesIds []any) error
	GetBulkPosts(queries map[string][]string) (paginator.ObjectPaginator, error)
}

type PostsHttpHandler struct {
	*base.Handler
	IPostsRepo
}

func (posts *PostsHttpHandler) GetHandler(context *gin.Context) {
	queries := context.Request.URL.Query()
	if data, err := posts.GetBulkPosts(queries); err != nil {
		context.JSON(helpers.GiveBadRequest(err.Error(), nil))

	} else {
		context.JSON(helpers.GiveOkPaginatedResponse(data))
	}
}

func (posts *PostsHttpHandler) GetSpecificHandler(context *gin.Context) {
	//TODO implement me
	panic("implement me")
}

func (posts *PostsHttpHandler) AddHandler(context *gin.Context) {
	userData, stopped := posts.UnwrapUserData(context)
	validatedBody, stopped := posts.Unwrap(context, AddPostDto)
	if stopped {
		return
	}
	if err := posts.AddPost(userData["userHash"].(string), validatedBody["content_text"].(string), validatedBody["files_ids"].([]any)); err != nil {
		context.JSON(helpers.GiveBadRequest(err.Error(), nil))
	} else {
		context.JSON(helpers.GiveOkResponse())
	}
}

func (posts *PostsHttpHandler) RemoveHandler(context *gin.Context) {

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
