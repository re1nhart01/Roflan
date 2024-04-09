package messaging

import (
	"github.com/gin-gonic/gin"
	"github.com/roflan.io/api/modules/messaging/http"
	"github.com/roflan.io/api/modules/messaging/repository"
	"github.com/roflan.io/api/modules/messaging/ws"
)

func RegisterHttpTopicsRouter(engine *gin.Engine, basePath string) {
	handler := http.NewTopicsHandler(basePath, repository.NewTopicsRepository())
	http.TopicsRoute(engine, handler)
}

func RegisterHttpMessageRouter(engine *gin.Engine, basePath string) {
	handler := http.NewMessageHandler(basePath, repository.NewMessageRepository())
	http.MessagesRoute(engine, handler)
}

func RegisterWSMessagingRouter(engine *gin.Engine, basePath string) {
	handler := ws.NewMessagingHandler(basePath, repository.NewMessageRepository())
	ws.MessagingWSRouter(engine, handler)
}
