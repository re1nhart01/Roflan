package http

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/roflan.io/api/base"
	"github.com/roflan.io/helpers"
	. "github.com/roflan.io/helpers"
	"github.com/roflan.io/paginator"
)

type ITopicsRepo interface {
	GetBulkTopics(userHash string, queries map[string][]string) (paginator.ObjectPaginator, error)
	CreateOrReceiveTopic(userHash, name string, isSingle bool, avatarBucket string, userIds []any) (map[string]any, error)
	GetTopic(topicHash string) (map[string]any, error)
}

type TopicsHttpHandler struct {
	*base.Handler
	ITopicsRepo
}

func (topics *TopicsHttpHandler) GetHandler(context *gin.Context) {
	userData, stopped := topics.UnwrapUserData(context)
	if stopped {
		return
	}
	if data, err := topics.GetBulkTopics(userData["userHash"].(string), context.Request.URL.Query()); err != nil {
		context.JSON(helpers.GiveBadRequest(err.Error(), nil))
	} else {
		context.JSON(helpers.GiveOkPaginatedResponse(data))
	}
}

func (topics *TopicsHttpHandler) GetSpecificHandler(context *gin.Context) {
	topicHash := context.Param("id")
	if len(topicHash) < 10 {
		context.JSON(GiveBadRequest("Invalid topic hash", nil))
		return
	}
	if data, err := topics.GetTopic(topicHash); err != nil {
		context.JSON(GiveBadRequest(err.Error(), nil))
	} else {
		context.JSON(GiveOkResponseWithData(data))
	}
}

func (topics *TopicsHttpHandler) AddHandler(context *gin.Context) {
	userData, stopped := topics.UnwrapUserData(context)
	validatedData, stopped := topics.Unwrap(context, AddTopicDto)
	if stopped {
		return
	}

	userHash := S(userData["userHash"])
	chatName := S(validatedData["name"])
	isSingle := F[bool](validatedData["isSingle"])
	avatarBucket := S(validatedData["avatarBucket"])
	userIds := F[[]any](validatedData["userIds"])

	if data, err := topics.CreateOrReceiveTopic(userHash, chatName, isSingle, avatarBucket, userIds); err != nil {
		context.JSON(helpers.GiveBadRequest(err.Error(), nil))
	} else {
		context.JSON(helpers.GiveOkResponseWithData(data))
	}
}

func (topics *TopicsHttpHandler) RemoveHandler(context *gin.Context) {
	context.JSON(helpers.GiveOkResponse())
}

func (topics *TopicsHttpHandler) UpdateHandler(context *gin.Context) {

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
