package api

import (
	"fmt"
	"github.com/roflan.io/api/base"
)

type IAuthRepo interface {
}

type AuthHttpHandler struct {
	*base.Handler
	IAuthRepo
}

func (auth *AuthHttpHandler) GetPath() string {
	return auth.Path
}

func (auth *AuthHttpHandler) GetName() string {
	return auth.Name
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
