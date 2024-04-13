package http

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/roflan.io/api/base"
)

type IFilesRepo interface {
}

type FilesHandler struct {
	*base.Handler
	IFilesRepo
}

func (files *FilesHandler) GetName() string {
	return files.Name
}

func (files *FilesHandler) GetPath() string {
	return files.Path
}

func (files *FilesHandler) AliveHandler(context *gin.Context) {
	context.JSON(200, "asd")
}

func NewFilesHandler(basePath string, repo IFilesRepo) *FilesHandler {
	return &FilesHandler{
		&base.Handler{
			Name: FILES_ROUTER,
			Path: fmt.Sprintf("/%s/files", basePath),
		},
		repo,
	}
}
