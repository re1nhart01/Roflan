package api

import "github.com/roflan.io/api/base"

type UserRepository struct {
	*base.Repository
}

func NewUsersRepository() *UserRepository {
	return &UserRepository{
		&base.Repository{TableName: "users"},
	}
}
