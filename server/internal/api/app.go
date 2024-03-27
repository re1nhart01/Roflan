package api

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/roflan.io/api/middleware"
	auth "github.com/roflan.io/api/modules/auth"
	root "github.com/roflan.io/api/modules/root"
	users "github.com/roflan.io/api/modules/users"
	"github.com/roflan.io/environment"
	"github.com/roflan.io/pg"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"
)

type Application struct {
	Ver      string
	ApiPath  string
	Instance *gin.Engine
}

func NewApp(withLogger bool) *Application {
	inst := &Application{
		Ver:      environment.GEnv().GetVariable("version"),
		ApiPath:  environment.GEnv().GetVariable("API_PATH"),
		Instance: gin.Default(),
	}
	inst.Instance.Use(
		gin.Recovery(),
		gin.Logger(),
	)

	if !withLogger {
		inst.Instance = gin.New()
	}
	return inst
}

func (app *Application) RunDatabaseBackgroundTasks() {

}

func (app *Application) Run(port string) error {

	root.RegisterHttpRootRouter(app.Instance, "")
	app.Instance.Use(middleware.BodyParserMiddlewareHandler)
	auth.RegisterHttpAuthRouter(app.Instance, app.ApiPath)
	app.Instance.Use(middleware.AuthMiddlewareHandler)
	users.RegisterHttpUsersRouter(app.Instance, app.ApiPath)

	httpServer := &http.Server{
		Addr:           port,
		Handler:        app.Instance,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}
	go app.RunDatabaseBackgroundTasks()

	go func() {
		if err := httpServer.ListenAndServe(); err != nil {
			log.Println("Failed to listen and serve: %+v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, os.Interrupt)
	v := <-quit
	fmt.Println(v.String())
	fmt.Println("Server closing...")

	defer pg.GetDatabaseInstance().Eliminate()

	return nil
}
