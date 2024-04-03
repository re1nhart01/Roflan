package api

import (
	"github.com/gin-gonic/gin"
	"github.com/roflan.io/api/base"
)

type IAuthHandler interface {
	base.IHandler
	AliveHandler(context *gin.Context)
	CheckIsExistsHandler(context *gin.Context)
	RegisterHandler(context *gin.Context)
}

func AuthRoute(engine *gin.Engine, handler IAuthHandler) {
	router := engine.Group(handler.GetPath())
	{
		router.POST(RegisterRoute, handler.RegisterHandler)
		router.POST(LoginRoute, handler.AliveHandler)
		router.PUT(CheckIsExistRoute, handler.CheckIsExistsHandler)
		router.POST(VerifyCode, handler.AliveHandler)
		router.PATCH(RefreshToken, handler.AliveHandler)
	}
}
