package api

import (
	"github.com/gin-gonic/gin"
	"github.com/roflan.io/api/base"
)

type IUserHandler interface {
	base.IHandler
	AliveHandler(context *gin.Context)
	GetMyProfile(context *gin.Context)
	GetUserList(context *gin.Context)
	UpdateUserFields(context *gin.Context)
}

func UserRoute(engine *gin.Engine, handler IUserHandler) {
	router := engine.Group(handler.GetPath())
	{
		router.GET(MeRoute, handler.GetMyProfile)
		router.GET(List, handler.GetUserList)
		router.PATCH(UpdateMe, handler.UpdateUserFields)
	}
}
