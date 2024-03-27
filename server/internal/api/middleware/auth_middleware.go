package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/roflan.io/environment"
	"github.com/roflan.io/helpers"
	"github.com/roflan.io/jwt"
	"strings"
)

func AuthMiddlewareHandler(context *gin.Context) {
	authHeader := context.Request.Header.Get("Authorization")

	if len(authHeader) < 20 {
		context.AbortWithStatusJSON(helpers.GiveUnauthorized())
		return
	}

	word := environment.GEnv().GetVariable("SPECIAL_WORD_BEARER")
	separator := environment.GEnv().GetVariable("SPECIAL_SYMBOL_BEARER")
	parsedHeader := strings.Split(authHeader, separator)
	if parsedHeader[0] != word {
		context.AbortWithStatusJSON(helpers.GiveUnauthorized())
		return
	}

	userHash, id, expirationTime, err := jwt.VerifyToken(strings.TrimSpace(parsedHeader[1]))

	if err != nil {
		context.AbortWithStatusJSON(helpers.GiveUnauthorized())
		return
	}
	body := map[string]any{
		"userHash":       userHash,
		"id":             id,
		"expirationTime": expirationTime,
	}

	context.Set("userData", body)
	context.Next()
}
