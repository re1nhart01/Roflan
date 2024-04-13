package main

import (
	"github.com/roflan.io/api"
	"github.com/roflan.io/environment"
	"github.com/roflan.io/pg"
)

func main() {
	environment.InitEnvironment("..\\internal\\config\\env.json")
	err := pg.ConnectToDatabase(false)
	pg.CreateSpecificDatabase(environment.GEnv().GetVariable("DB_NAME"))
	if err = api.NewApp(true).
		Run(environment.GEnv().GetVariable("PORT")); err != nil {
		panic(err)
	}
}
