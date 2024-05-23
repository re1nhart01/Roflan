package http

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/roflan.io/api/base"
	"github.com/roflan.io/helpers"
	. "github.com/roflan.io/helpers"
	"github.com/roflan.io/models"
	"github.com/roflan.io/paginator"
)

type IMessageRepo interface {
	AddMessage(userHash, topicHash, body string, mediaIds []string) (*models.MessageModelFull, error)
	BulkReadMessages(queries map[string][]string) (paginator.ObjectPaginator, error)
}

type MessageHttpHandler struct {
	*base.Handler
	IMessageRepo
}

func (message *MessageHttpHandler) GetHandler(context *gin.Context) {
	query := context.Request.URL.Query()

	if data, err := message.BulkReadMessages(query); err != nil {
		context.JSON(helpers.GiveBadRequest(err.Error(), nil))
	} else {
		context.JSON(helpers.GiveOkPaginatedResponse(data))
	}
}

func (message *MessageHttpHandler) GetSpecificHandler(context *gin.Context) {
	context.JSON(helpers.GiveOkResponse())
}

func (message *MessageHttpHandler) AddHandler(context *gin.Context) {
	userData, stopped := message.UnwrapUserData(context)
	validatedBody, stopped := message.Unwrap(context, AddMessageDto)
	if stopped {
		return
	}

	userHash := S(userData["userHash"])
	topicHash := S(validatedBody["topicHash"])
	body := S(validatedBody["body"])
	mediaIds := AnyToStringSlice(F[[]any](validatedBody["mediaIds"]))

	if data, err := message.AddMessage(userHash, topicHash, body, mediaIds); err != nil {
		context.JSON(GiveBadRequest(err.Error(), nil))
	} else {
		context.JSON(GiveOkResponseWithData(*data))
	}
}

func (message *MessageHttpHandler) GetMessagesCounter(context *gin.Context) {
	context.JSON(helpers.GiveOkResponse())
}

func (message *MessageHttpHandler) RemoveHandler(context *gin.Context) {
	context.JSON(helpers.GiveOkResponse())
}

func (message *MessageHttpHandler) UpdateHandler(context *gin.Context) {
	context.JSON(helpers.GiveOkResponse())
}

func (message *MessageHttpHandler) GetPath() string {
	return message.Path
}

func (message *MessageHttpHandler) GetName() string {
	return message.Name
}

func NewMessageHandler(basePath string, repo IMessageRepo) *MessageHttpHandler {
	return &MessageHttpHandler{
		&base.Handler{
			Name: MESSAGE_ROUTER,
			Path: fmt.Sprintf("/%s/messages", basePath),
		},
		repo,
	}
}
