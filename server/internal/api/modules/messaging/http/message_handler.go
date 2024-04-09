package http

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/roflan.io/api/base"
	"github.com/roflan.io/helpers"
)

type IMessageRepo interface {
}

type MessageHttpHandler struct {
	*base.Handler
	IMessageRepo
}

func (message *MessageHttpHandler) GetHandler(context *gin.Context) {
	context.JSON(helpers.GiveOkResponse())
}

func (message *MessageHttpHandler) GetSpecificHandler(context *gin.Context) {
	context.JSON(helpers.GiveOkResponse())
}

func (message *MessageHttpHandler) AddHandler(context *gin.Context) {
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
