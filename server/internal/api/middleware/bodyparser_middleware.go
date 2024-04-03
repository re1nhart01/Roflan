package middleware

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/roflan.io/helpers"
	"io"
)

const (
	BodyParserError1 = "body parser error 1"
	BodyParserError2 = "body parser error 2"
)

func BodyParserMiddlewareHandler(context *gin.Context) {
	currType := context.GetHeader("Content-Type")
	if currType == "application/json" {
		bodyBytes := context.Request.Body
		unmarshalledBody := make(map[string]any)
		data, err := io.ReadAll(bodyBytes)
		if err != nil {
			context.AbortWithStatusJSON(helpers.GiveUnprocessed(BodyParserError1))
			return
		}
		if err := json.Unmarshal(data, &unmarshalledBody); err != nil {
			context.AbortWithStatusJSON(helpers.GiveUnprocessed(BodyParserError2))
			return
		}
		context.Set("body", unmarshalledBody)
	} else if currType == "multipart/form-data" {
		//TODO: add for multipart handler
	}
	context.Next()
}
