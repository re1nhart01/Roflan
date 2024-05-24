package api

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/roflan.io/api/base"
	"github.com/roflan.io/helpers"
	"github.com/roflan.io/paginator"
)

type IUserRepo interface {
	ReadUserData(userHash string) (map[string]any, error)
	GetPaginatedUserList(queries map[string][]string) (paginator.ObjectPaginator, error)
	UpdateAndTransformField(userHash string, fields map[string]any) (map[string]any, error)
}

type UserHttpHandler struct {
	*base.Handler
	IUserRepo
}

func (user *UserHttpHandler) GetPath() string {
	return user.Path
}

func (user *UserHttpHandler) GetName() string {
	return user.Name
}

func (user *UserHttpHandler) GetUserList(context *gin.Context) {
	_, stopped := user.UnwrapUserData(context)
	if stopped {
		return
	}
	queries := context.Request.URL.Query()
	if data, err := user.GetPaginatedUserList(queries); err != nil {
		context.JSON(helpers.GiveBadRequest(err.Error(), nil))

	} else {
		context.JSON(helpers.GiveOkPaginatedResponse(data))
	}
}

func (user *UserHttpHandler) GetMyProfile(context *gin.Context) {
	userD, stopped := user.UnwrapUserData(context)
	if stopped {
		return
	}
	userHash := userD["userHash"].(string)

	userData, err := user.ReadUserData(userHash)
	if err != nil {
		fmt.Println(err.Error())
		context.JSON(helpers.GiveBadRequest(err.Error(), nil))
	} else {
		context.JSON(helpers.GiveOkResponseWithData(userData))
	}
}

func (user *UserHttpHandler) UpdatePreferences(context *gin.Context) {
	context.JSON(helpers.GiveBadRequest("NOT IMPLEMENTED!", nil))
}

func (user *UserHttpHandler) UpdateUserFields(context *gin.Context) {
	userD, stopped := user.UnwrapUserData(context)
	request, stopped := user.Unwrap(context, UpdateUserFieldDto)
	if stopped {
		return
	}
	userHash := userD["userHash"].(string)
	if result, err := user.UpdateAndTransformField(userHash, request); err != nil {
		fmt.Println(err)
		context.JSON(helpers.GiveBadRequest(err.Error(), nil))
	} else {
		context.JSON(helpers.GiveOkResponseWithData(result))
	}
}

func (user *UserHttpHandler) AliveHandler(context *gin.Context) {
	context.JSON(200, map[string]any{
		"alive": true,
	})
}

func NewUsersHandler(basePath string, repo IUserRepo) *UserHttpHandler {
	return &UserHttpHandler{
		&base.Handler{
			Name: USER_ROUTER,
			Path: fmt.Sprintf("/%s/users", basePath),
		},
		repo,
	}
}
