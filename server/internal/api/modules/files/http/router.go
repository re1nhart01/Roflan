package http

import (
	"github.com/gin-gonic/gin"
	"github.com/roflan.io/api/base"
)

type IFilesHandler interface {
	base.IHandler
	base.CRUDOps
}

func FilesRoute(engine *gin.Engine, handler IFilesHandler) {
	router := engine.Group(handler.GetPath())
	{
		router.GET(base.GetDetails, handler.GetSpecificHandler)
		router.GET(base.GetList, handler.GetHandler)
		router.POST(base.Add, handler.AddHandler)
		router.PATCH(base.Update, handler.UpdateHandler)
		router.DELETE(base.Delete, handler.RemoveHandler)
	}
}
