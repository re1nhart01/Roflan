package http

import (
	"github.com/gin-gonic/gin"
	"github.com/roflan.io/api/base"
)

type IFilesHandler interface {
	base.IHandler
	AliveHandler(context *gin.Context)
}

func FilesRoute(engine *gin.Engine, handler IFilesHandler) {
	router := engine.Group(handler.GetPath())
	{
		router.GET("alive", handler.AliveHandler)
	}
}
