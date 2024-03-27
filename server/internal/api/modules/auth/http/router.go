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
		router.POST(RegisterRoute, handler.AliveHandler)
		router.POST(LoginRoute, handler.AliveHandler)
		router.PUT(CheckIsExistRoute, handler.AliveHandler)
		router.POST(InitialVerificationRoute, handler.AliveHandler)
		router.POST(VerifyCode, handler.AliveHandler)
	}
}
