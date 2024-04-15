package base

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/roflan.io/dto"
	"github.com/roflan.io/helpers"
)

const (
	GetDetails = ":id"
	GetList    = ""
	Add        = ""
	Update     = ""
	Delete     = ""
)

type IHandler interface {
	GetName() string
	GetPath() string
}

type Handler struct {
	Name string
	Path string
}

type CRUDOps interface {
	GetHandler(context *gin.Context)
	GetSpecificHandler(context *gin.Context)
	AddHandler(context *gin.Context)
	RemoveHandler(context *gin.Context)
	UpdateHandler(context *gin.Context)
}

const (
	BodyNotExists = "Body Not Exists or it's empty"
)

func (h *Handler) UnwrapMultipart(context *gin.Context, dtoMap *dto.FieldsMapping) (map[string]any, bool) {
	bodyData, err := context.MultipartForm()
	if err != nil {
		context.JSON(helpers.GiveBadRequest(BodyNotExists, nil))
		return map[string]any{}, true
	}
	fmt.Println(bodyData.File, bodyData.Value)
	body, errorsDto := dto.ValidateModelWithDto(dto.MultipartBodyTransform{
		"files":  bodyData.File,
		"values": bodyData.Value,
	}, dtoMap, new(dto.ErrorList))
	if dto.HasErrors(errorsDto) {
		context.JSON(helpers.GiveBadRequest(dto.DtoError, errorsDto))
		return map[string]any{}, true
	}

	return body, false
}
func (h *Handler) Unwrap(context *gin.Context, dtoMap *dto.FieldsMapping) (map[string]any, bool) {
	bodyData, ok := context.Get("body")
	if !ok {
		context.JSON(helpers.GiveBadRequest(BodyNotExists, nil))
		return map[string]any{}, true
	}
	body, errorsDto := dto.ValidateModelWithDto(bodyData.(map[string]any), dtoMap, new(dto.ErrorList))
	if dto.HasErrors(errorsDto) {
		context.JSON(helpers.GiveBadRequest(dto.DtoError, errorsDto))
		return map[string]any{}, true
	}

	return body, false
}

func (h *Handler) UnwrapUserData(context *gin.Context) (map[string]any, bool) {
	bodyData, ok := context.Get("userData")
	if !ok {
		context.JSON(helpers.GiveBadRequest(BodyNotExists, nil))
		return map[string]any{}, true
	}

	return bodyData.(map[string]any), false
}

func (h *Handler) Knox(context *gin.Context, val []string) (map[string]any, bool) {
	result := map[string]any{}
	for _, v := range val {
		c := context.Param(v)
		if c != "" {
			result[v] = c
		}
		q := context.Query(v)
		if q != "" {
			result[v] = q
		}
	}

	return result, false
}
