package api

import (
	"github.com/gin-gonic/gin"
	"github.com/roflan.io/api/modules/posts/http"
)

func RegisterHttpPostsRouter(engine *gin.Engine, basePath string) {
	handler := http.NewPostsHandler(basePath, NewPostsRepository())
	http.PostsRoute(engine, handler)
}
