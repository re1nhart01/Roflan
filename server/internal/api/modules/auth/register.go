package api

import (
	"github.com/gin-gonic/gin"
	"github.com/roflan.io/api/modules/auth/http"
)

func RegisterHttpAuthRouter(engine *gin.Engine, basePath string) {
	handler := api.NewAuthHandler(basePath, NewAuthRepository())
	api.AuthRoute(engine, handler)
}
