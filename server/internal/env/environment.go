package environment

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"os"
	"path"
)

type Environment interface {
	GetVariable(key string) string
	SetVariable(key, value string) error
}

var SingletonEnvHandler *EnvironmentHandler

type EnvironmentHandler struct {
	TookVariables map[string]string
}

func parseFile(relativePath string) (map[string]any, error) {
	unmarshaledDict := map[string]any{}
	cwd, err := os.Getwd()
	if err != nil {
		return unmarshaledDict, errors.New("roflan.io error! on parseFile getWd")
	}
	absolutePath := path.Join(path.Dir(cwd), relativePath)
	fmt.Println(absolutePath)
	file, err := os.Open(absolutePath)
	if err != nil {
		return unmarshaledDict, errors.New(fmt.Sprintf("roflan.io error! on os.Open, path: %s", absolutePath))
	}
	defer file.Close()
	byteJson, err := ioutil.ReadAll(file)
	if err != nil {
		return unmarshaledDict, errors.New(fmt.Sprintf("roflan.io error! on ioutils.ReadAll, path: %s", absolutePath))
	}
	json.Unmarshal(byteJson, &unmarshaledDict)
	return unmarshaledDict, nil
}

func (env *EnvironmentHandler) GetVariable(key string) string {
	if env.TookVariables[key] == "" {
		return os.Getenv(key)
	} else {
		return env.TookVariables[key]
	}
}

func (env *EnvironmentHandler) SetVariable(key, value string) error {
	os.Setenv(key, value)
	env.TookVariables[key] = value
	return nil
}

func InitEnvironment(path string) {
	SingletonEnvHandler = &EnvironmentHandler{
		TookVariables: map[string]string{},
	}
	dict, _ := parseFile(path)

	for key, value := range dict {
		stringRepr, isOk := value.(string)
		if isOk {
			os.Setenv(key, stringRepr)
			SingletonEnvHandler.TookVariables[key] = stringRepr
		}
	}

}

func GEnv(withUpdate bool) *EnvironmentHandler {
	if SingletonEnvHandler == nil {
		SingletonEnvHandler = new(EnvironmentHandler)
	}
	return SingletonEnvHandler
}
