package api

import (
	"github.com/gin-gonic/gin"
	api "github.com/roflan.io/api/modules/root/http"
)

func RegisterHttpRootRouter(engine *gin.Engine, basePath string) {
	handler := api.NewRootHandler(basePath, map[string]string{})
	api.RootRoute(engine, handler)
}
