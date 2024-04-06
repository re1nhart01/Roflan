package base

import (
	"github.com/gin-gonic/gin"
	"github.com/roflan.io/dto"
	"github.com/roflan.io/helpers"
)

type IHandler interface {
	GetName() string
	GetPath() string
}

type Handler struct {
	Name string
	Path string
}

const (
	BodyNotExists = "Body Not Exists or it's empty"
)

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
