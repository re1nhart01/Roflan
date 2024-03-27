package jwt

import (
	"errors"
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"github.com/roflan.io/environment"
	"strconv"
	"strings"
	"time"
)

type UserClaim struct {
	UserHash string `json:"user_hash,omitempty"`
	Id       int    `json:"id,omitempty"`
	jwt.RegisteredClaims
}

func CreateToken(userHash string, id int, expirationTime *time.Time) (string, error) {
	serverKey := environment.GEnv().GetVariable("SERVER_KEY")

	claims := &UserClaim{
		UserHash:         userHash,
		Id:               id,
		RegisteredClaims: jwt.RegisteredClaims{},
	}

	if expirationTime != nil {
		claims.RegisteredClaims.ExpiresAt = jwt.NewNumericDate(*expirationTime)
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte(serverKey))
	fmt.Println(tokenString)
	return tokenString, err
}

func VerifyToken(tokenString string) (string, string, int64, error) {
	serverKey := environment.GEnv().GetVariable("SERVER_KEY")
	claimsInstance := &UserClaim{}
	println(serverKey)
	tToken, err := jwt.ParseWithClaims(tokenString, claimsInstance, func(token *jwt.Token) (interface{}, error) {
		//if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
		//	return nil, errors.New("unexpected signing method")
		//}
		return []byte(serverKey), nil
	})

	if err != nil || !tToken.Valid {
		return "", "", 0, err
	}

	if !tToken.Valid {
		return "", "", 0, err
	}
	return claimsInstance.UserHash, strconv.Itoa(claimsInstance.Id), claimsInstance.ExpiresAt.Unix(), nil
}

func ValidateToken(tokenString string) bool {
	serverKey := environment.GEnv().GetVariable("SERVER_KEY")
	_, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(serverKey), nil
	})

	if err != nil {
		return false
	}

	return true
}

func CheckIsTokenExpired(token string) bool {
	serverKey := environment.GEnv().GetVariable("SERVER_KEY")
	_, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(serverKey), nil
	})

	if err == nil {
		return false
	}
	return strings.Contains(err.Error(), "token is expired")
}
