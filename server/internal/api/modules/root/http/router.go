package api

import (
	"github.com/gin-gonic/gin"
	"github.com/roflan.io/api/base"
)

type IAuthHandler interface {
	base.IHandler
	AliveHandler(context *gin.Context)
}

func RootRoute(engine *gin.Engine, handler IAuthHandler) {
	router := engine.Group(handler.GetPath())
	{
		router.GET(ALIVE_ROUTE, handler.AliveHandler)
	}
}
