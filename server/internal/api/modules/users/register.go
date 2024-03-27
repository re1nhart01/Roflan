package api

import (
	"github.com/gin-gonic/gin"
	"github.com/roflan.io/api/modules/users/http"
)

func RegisterHttpUsersRouter(engine *gin.Engine, basePath string) {
	handler := api.NewUsersHandler(basePath, NewUsersRepository())
	api.UserRoute(engine, handler)
}
