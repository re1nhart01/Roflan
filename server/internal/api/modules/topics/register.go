package api

import (
	"github.com/gin-gonic/gin"
	api "github.com/roflan.io/api/modules/topics/http"
)

func RegisterHttpTopicsRouter(engine *gin.Engine, basePath string) {
	handler := api.NewTopicsHandler(basePath, NewTopicsRepository())
	api.AuthRoute(engine, handler)
}
