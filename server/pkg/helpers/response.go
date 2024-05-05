package helpers

import (
	"github.com/roflan.io/paginator"
	"net/http"
)

func GiveUnauthorized() (int, map[string]any) {
	return http.StatusUnauthorized, map[string]any{
		"statusCode": http.StatusUnauthorized,
		"message":    "StatusUnauthorized",
	}
}

func GiveUnprocessed(customMsg string) (int, map[string]any) {
	return http.StatusUnprocessableEntity, map[string]any{
		"statusCode": http.StatusUnprocessableEntity,
		"message":    "StatusUnprocessableEntity",
		"hint":       customMsg,
	}
}

func GiveBadRequest(customMsg string, data any) (int, map[string]any) {
	store := map[string]any{
		"statusCode": http.StatusBadRequest,
		"message":    "StatusBadRequest",
		"hint":       customMsg,
	}
	if data != nil {
		store["data"] = data
	}
	return http.StatusBadRequest, store
}

func GiveForbidden() (int, map[string]any) {
	return http.StatusForbidden, map[string]any{
		"statusCode": http.StatusForbidden,
		"message":    "StatusForbidden",
	}
}

func GiveOkResponse() (int, map[string]any) {
	return http.StatusOK, map[string]any{
		"statusCode": http.StatusOK,
		"message":    "Ok!",
	}
}

func GiveOkResponseWithData(data any) (int, map[string]any) {
	return http.StatusOK, map[string]any{
		"statusCode": http.StatusOK,
		"message":    "Ok!",
		"response":   data,
	}
}

func GiveOkPaginatedResponse(data paginator.ObjectPaginator) (int, paginator.ObjectPaginator) {
	data.Message = "Ok"
	data.StatusCode = 200
	return http.StatusOK, data
}

func GiveSocketMessage(tip string, data any) map[string]any {
	return map[string]any{
		"type": tip,
		"data": data,
	}
}
