package api

import (
	"errors"
	"fmt"
	"github.com/roflan.io/api/base"
	api2 "github.com/roflan.io/api/modules/auth/http"
	api "github.com/roflan.io/api/modules/users"
	"github.com/roflan.io/crypto"
	"github.com/roflan.io/environment"
	"github.com/roflan.io/jwt"
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

	if err := auth.CreateDefaultPreferences(userHash); err != nil {
		return errors.New(api2.CreatePreferencesError)
	}

	return modelling.Error
}

func (auth *AuthRepository) ValidateLogin(phone, password string) error {
	takenModel := models.UsersModel{}
	if err := pg.GDB().Instance.
		Table(models.UsersTable).
		Where("phone = ?", phone).
		Limit(1).
		Scan(&takenModel); err.Error != nil {
		return errors.New(api2.UserNotFound)
	}
	isValidPassword := crypto.CheckPasswordHash(password, takenModel.Password)
	if !isValidPassword {
		return errors.New(api2.InvalidPassword)
	}
	return nil
}

func (auth *AuthRepository) GenerateUserTokens(label, value string) (map[string]any, error) {
	user, err := auth.GetUserByField(label, value)
	if err != nil {
		return make(map[string]any), err
	}

	accessTokenExpiration := time.Now().Add(api2.AccessTokenExpirationTime * time.Second)
	accessToken, err := jwt.CreateToken(user.UserHash, user.Id, jwt.AccessTokenType, &accessTokenExpiration)
	if err != nil {
		return make(map[string]any), err
	}

	refreshTokenExpiration := time.Now().Add(api2.RefreshTokenExpirationTime * time.Second)
	refreshToken, err := jwt.CreateToken(user.UserHash, user.Id, jwt.RefreshTokenType, &refreshTokenExpiration)
	if err != nil {
		return make(map[string]any), err
	}

	tokenDict := map[string]any{
		"access_token":  accessToken,
		"refresh_token": refreshToken,
		"expires_in":    accessTokenExpiration.UnixMilli(),
	}

	return tokenDict, nil
}

func (auth *AuthRepository) VerifyRefresh(refreshToken string) (*jwt.UserClaim, error) {
	claims, err := jwt.VerifyToken(refreshToken)
	if err != nil {
		return new(jwt.UserClaim), err
	}
	isRefresh := claims.TokenType == "refresh"
	if !isRefresh {
		return new(jwt.UserClaim), errors.New(api2.TokenIsNotRefresh)
	}

	if time.Now().UnixMilli() > claims.ExpiresAt.UnixMilli() {
		return new(jwt.UserClaim), errors.New(api2.RefreshExpires)
	}

	return claims, nil
}

func NewAuthRepository() *AuthRepository {
	return &AuthRepository{
		Repository:     &base.Repository{TableName: "users"},
		UserRepository: api.NewUsersRepository(),
	}
}
