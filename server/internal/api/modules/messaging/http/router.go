package http

import (
	"github.com/gin-gonic/gin"
	"github.com/roflan.io/api/base"
)

type IMessagingCRUD interface {
	base.IHandler
	GetHandler(context *gin.Context)
	GetSpecificHandler(context *gin.Context)
	AddHandler(context *gin.Context)
	RemoveHandler(context *gin.Context)
	UpdateHandler(context *gin.Context)
}

func TopicsRoute(engine *gin.Engine, handler IMessagingCRUD) {
	router := engine.Group(handler.GetPath())
	{
		router.GET(GetDetails, handler.GetSpecificHandler)
		router.GET(GetList, handler.GetHandler)
		router.POST(Add, handler.AddHandler)
		router.PATCH(Update, handler.UpdateHandler)
		router.DELETE(Delete, handler.RemoveHandler)
	}
}

func MessagesRoute(engine *gin.Engine, handler IMessagingCRUD) {
	router := engine.Group(handler.GetPath())
	{
		router.GET(GetDetails, handler.GetSpecificHandler)
		router.GET(GetList, handler.GetHandler)
		router.POST(Add, handler.AddHandler)
		router.PATCH(Update, handler.UpdateHandler)
		router.DELETE(Delete, handler.RemoveHandler)
	}
}
