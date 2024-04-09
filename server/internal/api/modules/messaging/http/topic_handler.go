package http

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/roflan.io/api/base"
	"github.com/roflan.io/helpers"
)

type ITopicsRepo interface {
}

type TopicsHttpHandler struct {
	*base.Handler
	ITopicsRepo
}

func (topics *TopicsHttpHandler) GetHandler(context *gin.Context) {
	context.JSON(helpers.GiveOkResponse())
}

func (topics *TopicsHttpHandler) GetSpecificHandler(context *gin.Context) {
	context.JSON(helpers.GiveOkResponse())
}

func (topics *TopicsHttpHandler) AddHandler(context *gin.Context) {
	context.JSON(helpers.GiveOkResponse())
}

func (topics *TopicsHttpHandler) RemoveHandler(context *gin.Context) {
	context.JSON(helpers.GiveOkResponse())
}

func (topics *TopicsHttpHandler) UpdateHandler(context *gin.Context) {
	context.JSON(helpers.GiveOkResponse())
}

func (topics *TopicsHttpHandler) GetPath() string {
	return topics.Path
}

func (topics *TopicsHttpHandler) GetName() string {
	return topics.Name
}

func NewTopicsHandler(basePath string, repo ITopicsRepo) *TopicsHttpHandler {
	return &TopicsHttpHandler{
		&base.Handler{
			Name: TOPICS_ROUTER,
			Path: fmt.Sprintf("/%s/topic", basePath),
		},
		repo,
	}
}
