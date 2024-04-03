package api

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/roflan.io/api/base"
	"github.com/roflan.io/dto"
	"github.com/roflan.io/helpers"
)

type IAuthRepo interface {
	CheckIsExistsByField(string, string) bool
	CreateInitialUser(username, password, firstName, lastName, patronymic string, role int, phone, sex string) error
}

type AuthHttpHandler struct {
	*base.Handler
	IAuthRepo
}

func (auth *AuthHttpHandler) AliveHandler(context *gin.Context) {
	//TODO implement me
	panic("implement me")
}

func (auth *AuthHttpHandler) GetPath() string {
	return auth.Path
}

func (auth *AuthHttpHandler) GetName() string {
	return auth.Name
}

func (auth *AuthHttpHandler) RegisterHandler(context *gin.Context) {
	bodyData, ok := context.Get("body")
	if !ok {
		context.JSON(helpers.GiveBadRequest(BodyNotExists, nil))
		return
	}
	body, errors := dto.ValidateModelWithDto(bodyData.(map[string]any), AuthRegisterDto, new(dto.ErrorList))
	if dto.HasErrors(errors) {
		context.JSON(helpers.GiveBadRequest(dto.DtoError, errors))
		return
	}
	isCreated := auth.CreateInitialUser(
		helpers.HandleStringValues(body["username"], ""),
		helpers.HandleStringValues(body["password"], ""),
		helpers.HandleStringValues(body["firstName"], ""),
		helpers.HandleStringValues(body["lastName"], ""),
		helpers.HandleStringValues(body["patronymic"], ""),
		int(helpers.HandleNilValues(body["role"], 0).(float64)),
		helpers.HandleStringValues(body["phone"], ""),
		helpers.HandleStringValues(body["sex"], "other"),
	)
	if isCreated == nil {
		context.JSON(helpers.GiveOkResponse())
	} else {
		context.JSON(helpers.GiveBadRequest(isCreated.Error(), nil))
	}
}

func (auth *AuthHttpHandler) LoginHandler(context *gin.Context) {
	context.JSON(200, map[string]any{
		"alive": true,
	})
}

func (auth *AuthHttpHandler) CheckIsExistsHandler(context *gin.Context) {
	bodyData, ok := context.Get("body")
	if !ok {
		context.JSON(helpers.GiveBadRequest(BodyNotExists, nil))
		return
	}
	body, errors := dto.ValidateModelWithDto(bodyData.(map[string]any), AuthCheckEmailDto, new(dto.ErrorList))
	if dto.HasErrors(errors) {
		context.JSON(helpers.GiveBadRequest(dto.DtoError, errors))
		return
	}
	isUserExists := auth.CheckIsExistsByField(CheckIsExistsLabel, body[CheckIsExistsLabel].(string))
	context.JSON(helpers.GiveOkResponseWithData(isUserExists))
}

func (auth *AuthHttpHandler) VerifyCodeHandler(context *gin.Context) {
	context.JSON(200, map[string]any{
		"alive": true,
	})
}

func (auth *AuthHttpHandler) RefreshTokensHandler(context *gin.Context) {
	context.JSON(200, map[string]any{
		"alive": true,
	})
}

func NewAuthHandler(basePath string, repo IAuthRepo) *AuthHttpHandler {
	return &AuthHttpHandler{
		&base.Handler{
			Name: AUTH_ROUTER,
			Path: fmt.Sprintf("/%s/auth", basePath),
		},
		repo,
	}
}
