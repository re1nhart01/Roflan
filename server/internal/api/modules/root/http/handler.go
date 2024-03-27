package api

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/roflan.io/api/base"
	"github.com/roflan.io/environment"
)

type IRootRepo interface {
}

type RootHttpHandler struct {
	*base.Handler
	IRootRepo
}

func (root *RootHttpHandler) GetPath() string {
	return root.Path
}

func (root *RootHttpHandler) GetName() string {
	return root.Name
}

func (root *RootHttpHandler) AliveHandler(context *gin.Context) {
	context.JSON(200, map[string]any{
		"alive":   true,
		"version": environment.GEnv().GetVariable("version"),
		"author":  environment.GEnv().GetVariable("AUTHOR"),
	})
}

func NewRootHandler(basePath string, repo IRootRepo) *RootHttpHandler {
	return &RootHttpHandler{
		&base.Handler{
			Name: ROOT_ROUTER,
			Path: fmt.Sprintf("/%s", basePath),
		},
		repo,
	}
}
