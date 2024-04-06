package api

import (
	"github.com/gin-gonic/gin"
	"github.com/roflan.io/api/base"
)

type IAuthHandler interface {
	base.IHandler
	AliveHandler(context *gin.Context)
}

func AuthRoute(engine *gin.Engine, handler IAuthHandler) {
	router := engine.Group(handler.GetPath())
	{
		router.GET(GetDetails, handler.AliveHandler)
		router.GET(GetList, handler.AliveHandler)
		router.POST(Add, handler.AliveHandler)
		router.PATCH(Update, handler.AliveHandler)
		router.DELETE(Delete, handler.AliveHandler)
	}
}
