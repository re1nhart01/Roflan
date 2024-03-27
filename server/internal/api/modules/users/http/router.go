package api

import (
	"github.com/gin-gonic/gin"
	"github.com/roflan.io/api/base"
)

type IUserHandler interface {
	base.IHandler
	AliveHandler(context *gin.Context)
}

func UserRoute(engine *gin.Engine, handler IUserHandler) {
	router := engine.Group(handler.GetPath())
	{
		router.POST(MeRoute, handler.AliveHandler)
	}
}
