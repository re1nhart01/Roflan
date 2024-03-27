package api

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/roflan.io/api/base"
)

type IUserRepo interface {
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
