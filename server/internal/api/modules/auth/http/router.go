package api

import (
	"github.com/gin-gonic/gin"
	"github.com/roflan.io/api/base"
)

type IAuthHandler interface {
	base.IHandler
}

func AuthRoute(engine *gin.Engine, handler IAuthHandler) {
	router := engine.Group(handler.GetPath())
	{
		router.GET(REGISTER_ROUTE, func(context *gin.Context) {
			context.JSON(200, map[string]string{
				"asd": "asdas",
			})
		})
	}
}