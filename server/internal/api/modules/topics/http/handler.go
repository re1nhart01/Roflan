package api

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/roflan.io/api/base"
)

type ITopicsRepo interface {
}

type TopicsHttpHandler struct {
	*base.Handler
	ITopicsRepo
}

func (topics *TopicsHttpHandler) AliveHandler(context *gin.Context) {
	panic("implement me")
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
			Path: fmt.Sprintf("/%s/topics", basePath),
		},
		repo,
	}
}
