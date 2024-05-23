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
		context.JSON(helpers.GiveBadRequest(err.Error(), nil))
		return
	}

	context.JSON(helpers.GiveOkResponseWithData(userData))
}

func (user *UserHttpHandler) UpdatePreferences(context *gin.Context) {

}

func (user *UserHttpHandler) UpdateUserFields(context *gin.Context) {

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
