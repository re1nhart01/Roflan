package api

import (
	"github.com/roflan.io/api/base"
	api "github.com/roflan.io/api/modules/users"
)

type FilesRepository struct {
	*base.Repository
	*api.UserRepository
}

func NewFilesRepository() *FilesRepository {
	return &FilesRepository{
		Repository:     &base.Repository{TableName: "files"},
		UserRepository: api.NewUsersRepository(),
	}
}
