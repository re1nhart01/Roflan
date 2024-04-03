package api

import (
	"fmt"
	"github.com/roflan.io/api/base"
	api "github.com/roflan.io/api/modules/users"
	"github.com/roflan.io/crypto"
	"github.com/roflan.io/environment"
	"github.com/roflan.io/models"
	"github.com/roflan.io/pg"
	"time"
)

type AuthRepository struct {
	*base.Repository
	*api.UserRepository
}

func (auth *AuthRepository) CreateInitialUser(username, password, firstName, lastName, patronymic string, role int, phone, sex string) error {
	hashedPassword := crypto.HashPassword(password)
	serverHash := environment.GEnv().GetVariable("SERVER_KEY")
	userSalt := fmt.Sprintf("%s:%s:%s:%s", username, firstName, lastName, patronymic)
	userHash := crypto.GetSha1(serverHash, userSalt)
	userModel := models.UsersModel{
		UserHash:   userHash,
		Username:   username,
		FirstName:  firstName,
		LastName:   lastName,
		Patronymic: patronymic,
		Role:       role,
		Sex:        sex,
		Active:     true,
		Password:   hashedPassword,
		Phone:      phone,
		Birthday:   time.Now(),
	}
	modelling := pg.GDB().Instance.Table(models.UsersTable).Create(&userModel)
	return modelling.Error
}

func NewAuthRepository() *AuthRepository {
	return &AuthRepository{
		Repository:     &base.Repository{TableName: "users"},
		UserRepository: api.NewUsersRepository(),
	}
}
