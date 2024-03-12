package main

import (
	"fmt"
	"os"

	"github.com/roflan.io/environment"
	"github.com/roflan.io/jwt"
)

func main() {
	jwt.NewJWtHandler()
	environment.InitEnvironment("../internal/config/env.json")

	fmt.Println(environment.SingletonEnvHandler.GetVariable("HELLO"))
	for k, v := range os.Environ() {
		fmt.Println(k, v)
	}
}
