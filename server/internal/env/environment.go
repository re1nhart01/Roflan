package environment

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"os"
	"path"
)

type Environment interface {
	GetVariable(key string) string
	SetVariable(key, value string) error
}

var SingletonEnvHandler *Handler

type Handler struct {
	TookVariables map[string]string
}

func parseFile(relativePath string) (map[string]any, error) {
	unmarshalledDict := map[string]any{}
	cwd, err := os.Getwd()
	if err != nil {
		return unmarshalledDict, errors.New("roflan.io error! on parseFile getWd")
	}
	absolutePath := path.Join(path.Dir(cwd), relativePath)
	file, err := os.Open("C:\\Users\\eugen\\Documents\\GitHub\\roflan\\server\\internal\\config\\env.json")
	if err != nil {
		return unmarshalledDict, errors.New(fmt.Sprintf("roflan.io error! on os.Open, path: %s", absolutePath))
	}
	defer file.Close()
	byteJson, err := io.ReadAll(file)
	if err != nil {
		return unmarshalledDict, errors.New(fmt.Sprintf("roflan.io error! on ioutils.ReadAll, path: %s", absolutePath))
	}
	_ = json.Unmarshal(byteJson, &unmarshalledDict)
	return unmarshalledDict, nil
}

func (env *Handler) GetVariable(key string) string {
	if env.TookVariables[key] == "" {
		return os.Getenv(key)
	} else {
		return env.TookVariables[key]
	}
}

func (env *Handler) SetVariable(key, value string) error {
	_ = os.Setenv(key, value)
	env.TookVariables[key] = value
	return nil
}

func InitEnvironment(path string) {
	SingletonEnvHandler = &Handler{
		TookVariables: map[string]string{},
	}
	dict, _ := parseFile(path)

	for key, value := range dict {
		stringRepresentation, isOk := value.(string)
		if isOk {
			_ = os.Setenv(key, stringRepresentation)
			SingletonEnvHandler.TookVariables[key] = stringRepresentation
		}
	}

}

func GEnv() *Handler {
	if SingletonEnvHandler == nil {
		SingletonEnvHandler = new(Handler)
	}
	return SingletonEnvHandler
}
