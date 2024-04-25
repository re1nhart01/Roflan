package helpers

import (
	"crypto/rand"
	"encoding/json"
	"io"
	"regexp"
	"strings"
)

type TagsInterests interface {
	GetId() int
}

var table = [...]byte{'1', '2', '3', '4', '5', '6', '7', '8', '9', '0'}

type listOf []TagsInterests

func Includes[T comparable](list []T, item T) (bool, T, int) {
	if len(list) == 0 {
		return false, item, -1
	}
	for k, v := range list {
		if v == item {
			return true, item, k
		}
	}
	return false, item, -1
}

func ForEachOrError[T comparable](list []T, callback func(item T, index int, list []T) error) error {
	if len(list) == 0 {
		return nil
	}

	for k, v := range list {
		if err := callback(v, k, list); err != nil {
			return err
		}
	}

	return nil
}

func GetIntListFromModel(list listOf) []int {
	result := []int{}
	for _, v := range list {
		result = append(result, v.GetId())
	}
	return result
}

func ShortInclude[T comparable](list []T, item T) bool {
	if len(list) == 0 {
		return false
	}
	for _, v := range list {
		if v == item {
			return true
		}
	}
	return false
}

func Some[T comparable](list []T, callback func(item T, index int) bool) bool {
	result := true
	if len(list) == 0 {
		return false
	}
	for k, v := range list {
		if callback(v, k) {
			result = true
		}
	}
	return result
}

func Every[T comparable](list []T, callback func(item T, index int) bool) bool {
	result := true
	if len(list) == 0 {
		return false
	}
	for k, v := range list {
		if !callback(v, k) {
			result = false
		}
	}
	return result
}

func IsArrayIncludes[T comparable](list, list2 []T) bool {
	return Every(list, func(item T, index int) bool {
		inc, _, _ := Includes(list2, item)
		return inc
	})
}

func HandleNilValues(val any, defaultVal any) any {
	if val == nil {
		return defaultVal
	}
	return val
}

func HandleStringValues(val any, defaultVal string) string {
	castedVal, ok := val.(string)
	if val == nil || !ok {
		return defaultVal
	}
	return castedVal
}

func CheckIsValidContentType(needable string, list []string) bool {
	for _, v := range list {
		subStr := strings.Contains(v, needable)
		if subStr {
			return true
		}
	}
	return false
}

func GetFileExtensionFromFile(fileName string) string {
	splitted := strings.Split(fileName, ".")
	if len(splitted) < 2 {
		return ""
	}
	return splitted[1]
}

func EncodeToString(max int) string {
	b := make([]byte, max)
	n, err := io.ReadAtLeast(rand.Reader, b, max)
	if n != max {
		panic(err)
	}
	for i := 0; i < len(b); i++ {
		b[i] = table[int(b[i])%len(table)]
	}
	return string(b)
}

func HasPhoneNumber(s string) bool {
	phoneRegex := `(?i)\+?\d[\d\s\-\(\)]{7,}\d`
	r, err := regexp.Compile(phoneRegex)
	if err != nil {
		return false
	}
	return r.MatchString(s)
}

func ParseByteToMap(data []byte) map[string]any {
	result := map[string]any{}
	err := json.Unmarshal(data, &result)
	if err != nil {
		return map[string]any{}
	}
	return result
}
