package dto

import (
	"fmt"
	"github.com/roflan.io/helpers"
	"reflect"
	"regexp"
	"sync"
)

/*
defaultValue: "",

	type: "STRING",
	required: true,
	min: 5,
	max: 20
*/

// dto_required: "yes" or "no"
// dto_min: "500" if string then length of string and number is count
// dto_max: "100" if string then length of string and number is count
// dto_default: "aboba" || "bool(true)" || "num(10)" || "obj({})"
// dto_anyType: "true" || "false"
// dto_name: "aboba" // for errors and etc.
// dto_remove: "true" || "false"
// dto_map_flat: "true" || "false"

type ErrorDto struct {
	FieldName string   `json:"field_name"`
	ErrorMsg  []string `json:"error_msg"`
}

// ErrorList STRING | INTEGER | BOOL | NULL | OBJECT

type ErrorList = []ErrorDto
type FieldsMapping map[string]*FieldDto

var dtoWg *sync.WaitGroup

type FieldDto struct {
	Type             string
	Required         bool
	Min              any
	Max              any
	DefaultValue     any
	RegexpValidation *regexp.Regexp
	AnyType          bool
	Name             string
	Remove           bool
	Aliases          []string
	Body             FieldsMapping
	MaxLength        int
	MinLength        int
	AcceptOnly       []any
}

var MapTypes = map[string]string{
	"STRING":  "string",
	"INTEGER": "int",
	"OBJECT":  "map[string]interface {}",
	"NULL":    "null",
	"ARRAY":   "[]interface {}",
	"FLOAT":   "float64",
	"BOOL":    "bool",
}

func addError(errs *ErrorList, key string, errorStringList ...string) {
	*errs = append(*errs, ErrorDto{
		FieldName: key,
		ErrorMsg:  errorStringList,
	})
}

const (
	DtoError = "Errors in response data transfer object"
)

func HasErrors(errors *ErrorList) bool {
	if len(*errors) != 0 {
		return true
	}
	return false
}

func isIntegral(val float64) bool {
	return val == float64(int(val))
}

func ValidateModelWithDto(body map[string]any, typeModel *FieldsMapping, errors *ErrorList) (map[string]any, *ErrorList) {
	for k, v := range *typeModel {

		fieldFromBody := body[k]
		isIncludesAliases, _, _ := helpers.Includes(v.Aliases, k)
		if fieldFromBody == nil && !isIncludesAliases && v.Required {
			addError(errors, k, fmt.Sprintf("Field %s is required.", k))
			continue
		}
		if fieldFromBody == nil {
			continue
		}
		typeOfField := reflect.TypeOf(fieldFromBody).String()
		if typeOfField == "float64" {
			v1 := reflect.ValueOf(fieldFromBody)
			v1 = reflect.Indirect(v1)
			fv := v1.Convert(reflect.TypeOf(float64(0)))
			if isIntegral(fv.Float()) {
				typeOfField = "int"
				fieldFromBody = fv.Interface()
			}
		}
		typeEqual := MapTypes[v.Type] == typeOfField

		if MapTypes[v.Type] != typeOfField {
			addError(errors, k, fmt.Sprintf("Type mismatch, expects %s but got %s", MapTypes[v.Type], typeOfField))
			continue
		}
		validateString(v, typeEqual, fieldFromBody, errors, k)
		validateInteger(v, typeEqual, fieldFromBody, errors, k)
		validateFloat64(v, typeEqual, fieldFromBody, errors, k)
		validateArray(v, typeEqual, fieldFromBody, errors, k)
		validateBool(v, typeEqual, fieldFromBody, errors, k)
		validateObject(v, typeEqual, fieldFromBody, errors, k)
	}
	return body, errors
}
