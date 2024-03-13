package api

import "github.com/roflan.io/api/base"

type AuthRepository struct {
	*base.Repository
}

func NewAuthRepository() *AuthRepository {
	return &AuthRepository{
		&base.Repository{TableName: "users"},
	}
}
