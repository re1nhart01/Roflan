package middleware

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/roflan.io/api"
	"github.com/roflan.io/helpers"
	"io"
)

func BodyParserMiddlewareHandler(context *gin.Context) {
	currType := context.GetHeader("Content-Type")
	if currType == "application/json" {
		bodyBytes := context.Request.Body
		unmarshalledBody := make(map[string]any)
		data, err := io.ReadAll(bodyBytes)
		if err != nil {
			context.AbortWithStatusJSON(helpers.GiveUnprocessed(api.BodyParserError1))
			return
		}
		if err := json.Unmarshal(data, &unmarshalledBody); err != nil {
			context.AbortWithStatusJSON(helpers.GiveUnprocessed(api.BodyParserError2))
			return
		}
		context.Set("body", unmarshalledBody)
	} else if currType == "multipart/form-data" {
		//TODO: add for multipart handler
	}
	context.Next()
}
