package ws

import (
	"github.com/gin-gonic/gin"
	"github.com/roflan.io/api/base"
)

type IMessagingWS interface {
	base.IHandler
	ConnectToSocketHandler(context *gin.Context)
}

func MessagingWSRouter(engine *gin.Engine, handler IMessagingWS) {
	router := engine.Group(handler.GetPath())
	{
		router.GET(ConnectSocket, handler.ConnectToSocketHandler)
	}
}
