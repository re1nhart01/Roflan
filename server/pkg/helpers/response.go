package helpers

import "net/http"

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
