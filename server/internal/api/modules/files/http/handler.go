package http

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/roflan.io/api/base"
	"github.com/roflan.io/helpers"
	"github.com/roflan.io/paginator"
	"mime/multipart"
	"net/http"
)

type IFilesRepo interface {
	AddFile(userHash string, files []*multipart.FileHeader) error
	BulkRemoveFile(userHash string, ids []any) error
	BulkGetFiles(userHash string, queries map[string][]string) (paginator.ObjectPaginator, error)
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

func (files *FilesHandler) GetHandler(context *gin.Context) {
	userData, stopped := files.UnwrapUserData(context)
	if stopped {
		return
	}
	if data, err := files.BulkGetFiles(userData["userHash"].(string), context.Request.URL.Query()); err != nil {
		context.JSON(helpers.GiveBadRequest(err.Error(), nil))
	} else {
		context.JSON(helpers.GiveOkPaginatedResponse(data))
	}
}

func (files *FilesHandler) GetSpecificHandler(context *gin.Context) {
	context.JSON(200, "asd33")
}

func (files *FilesHandler) AddHandler(context *gin.Context) {
	userData, stopped := files.UnwrapUserData(context)
	validatedBody, stopped := files.UnwrapMultipart(context, AddFile)
	if stopped {
		return
	}

	for _, listOfFiles := range validatedBody["files"].(map[string][]*multipart.FileHeader) {
		err := files.AddFile(userData["userHash"].(string), listOfFiles)
		if err != nil {
			context.JSON(helpers.GiveBadRequest(err.Error(), nil))
			return
		}
	}

	context.Status(http.StatusOK)
}

func (files *FilesHandler) RemoveHandler(context *gin.Context) {
	userData, stopped := files.UnwrapUserData(context)
	validatedData, stopped := files.Unwrap(context, RemoveFileDto)

	if stopped {
		return
	}

	if err := files.BulkRemoveFile(userData["userHash"].(string), validatedData["ids"].([]any)); err != nil {
		context.JSON(helpers.GiveBadRequest(err.Error(), nil))
		return
	}

	context.JSON(helpers.GiveOkResponse())
}

func (files *FilesHandler) UpdateHandler(context *gin.Context) {
	context.JSON(200, "asd2")
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
