package main

import (
	"fmt"
	"github.com/roflan.io/api"
	"github.com/roflan.io/environment"
	"github.com/roflan.io/pg"
)

func main() {
	environment.InitEnvironment("..\\internal\\config\\env.json")
	err := pg.ConnectToDatabase(false)
	fmt.Println(err)
	pg.CreateSpecificDatabase(environment.GEnv().GetVariable("DB_NAME"))
	app := api.NewApp(false)
	err = app.Run(environment.GEnv().GetVariable("PORT"))
	if err != nil {
		panic(err)
	}
}
