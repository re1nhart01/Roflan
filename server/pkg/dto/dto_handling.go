package dto

import (
	"fmt"
	"github.com/roflan.io/helpers"
	"mime/multipart"
	"reflect"
)

func validateString(v *FieldDto, typeEqual bool, fieldFromBody any, errors *ErrorList, index string) {
	if v.Type == "STRING" && typeEqual {
		fieldAsString := fieldFromBody.(string)
		l := len(fieldAsString)
		if v.RegexpValidation != nil {
			if !v.RegexpValidation.MatchString(fieldAsString) {
				addError(errors, index, fmt.Sprintf("String '%s' is not valid", fieldAsString))
			}
		}
		if v.AcceptOnly != nil && !helpers.ShortInclude(v.AcceptOnly, fieldFromBody) {
			addError(errors, index, "String only accept specific values")
		}
		if v.Min != nil && l < v.Min.(int) {
			addError(errors, index, fmt.Sprintf("String should expect min length %d but got less %d", v.Min.(int), l))
		}
		if v.Max != nil && l > v.Max.(int) {
			addError(errors, index, fmt.Sprintf("String should expect max length %d but got greater: %d", v.Max.(int), l))
		}
	}
}

func validateInteger(v *FieldDto, typeEqual bool, fieldFromBody any, errors *ErrorList, index string) {
	if v.Type == "INTEGER" && typeEqual {
		cField := int(fieldFromBody.(float64))
		if v.Min != nil && cField < v.Min.(int) {
			addError(errors, index, fmt.Sprintf("Number should expect less than %d but got: %d", v.Min.(int), cField))
		}
		if v.Max != nil && cField > v.Max.(int) {
			addError(errors, index, fmt.Sprintf("Number should expect greater than %d but got: %d", v.Max.(int), cField))
		}
	}
}

func validateFloat64(v *FieldDto, typeEqual bool, fieldFromBody any, errors *ErrorList, index string) {
	if v.Type == "FLOAT" && typeEqual {
		cField := fieldFromBody.(float64)
		if v.Min != nil && cField < float64(v.Min.(int)) {
			addError(errors, index, fmt.Sprintf("Number should expect less than %d but got: %d", v.Min.(int), cField))
		}
		if v.Max != nil && cField > float64(v.Max.(int)) {
			addError(errors, index, fmt.Sprintf("Number should expect greater than %d but got: %d", v.Max.(int), cField))
		}
	}
}

func validateArray(v *FieldDto, typeEqual bool, fieldFromBody any, errors *ErrorList, index string) {
	if v.Type == "ARRAY" && typeEqual {
		cField, ok := fieldFromBody.([]any)
		if !ok {
			addError(errors, index, fmt.Sprintf("Type mismatch should be array but got %s", reflect.TypeOf(fieldFromBody).String()))
		}
		if v.MinLength > len(cField) || v.MaxLength < len(cField) {
			addError(errors, index, fmt.Sprintf("Length of this list is less than expected. Should be %d but got: %d", v.MinLength, len(cField)))
		}
		if v.AcceptOnly != nil {
			isIncludesAll := helpers.IsArrayIncludes(v.AcceptOnly, cField)
			if !isIncludesAll {
				addError(errors, index, "Tuple list is not includes all items")
			}
		}
	}
}

func validateObject(v *FieldDto, typeEqual bool, fieldFromBody any, errors *ErrorList, index string) {
	if v.Type == "OBJECT" && typeEqual && v.Body != nil {
		ValidateModelWithDto(fieldFromBody.(map[string]interface{}), &v.Body, errors)
	}
}

func validateBool(v *FieldDto, typeEqual bool, fieldFromBody any, errors *ErrorList, index string) {
	if v.Type == "BOOL" && typeEqual {
		return
	}
}

func validateFile(v *FieldDto, typeEqual bool, fieldFromBody any, errors *ErrorList, index string) {
	if v.Type == "MULTIPART_FILE" && typeEqual {
		cField, ok := fieldFromBody.(map[string][]*multipart.FileHeader)
		if !ok {
			addError(errors, index, "Type mismatch should be files but got something else")
		}
		if v.Body != nil {
			for _, v := range v.Body {
				if cField[v.Name] == nil {
					addError(errors, index, fmt.Sprintf("File with name %s is not exists", v.Name))
				}
			}
		}
	}

	if v.Type == "MULTIPART_VALUES" {
		cField, ok := fieldFromBody.(map[string][]string)
		if !ok {
			addError(errors, index, "Type mismatch should be strings but got something else")
		}
		if v.Body != nil {
			for _, v := range v.Body {
				if cField[v.Name] == nil {
					addError(errors, index, fmt.Sprintf("Value with name %s is not exists", v.Name))
				}
			}
		}
	}
}
