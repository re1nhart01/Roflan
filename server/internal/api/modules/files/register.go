package api

import (
	"github.com/gin-gonic/gin"
	"github.com/roflan.io/api/modules/files/http"
)

func RegisterHttpFilesRouter(engine *gin.Engine, basePath string) {
	handler := http.NewFilesHandler(basePath, NewFilesRepository())
	http.FilesRoute(engine, handler)
}
