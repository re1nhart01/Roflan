package http

import (
	"github.com/gin-gonic/gin"
	"github.com/roflan.io/api/base"
)

type IPostsCRUD interface {
	base.IHandler
	base.CRUDOps
}

func PostsRoute(engine *gin.Engine, handler IPostsCRUD) {
	router := engine.Group(handler.GetPath())
	{
		router.GET(base.GetDetails, handler.GetSpecificHandler)
		router.GET(base.GetList, handler.GetHandler)
		router.POST(base.Add, handler.AddHandler)
		router.PATCH(base.Update, handler.UpdateHandler)
		router.DELETE(base.Delete, handler.RemoveHandler)
	}
}
