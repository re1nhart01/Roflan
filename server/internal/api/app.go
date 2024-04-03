package api

import (
	"fmt"
	"github.com/gin-gonic/gin"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/roflan.io/api/middleware"
	auth "github.com/roflan.io/api/modules/auth"
	root "github.com/roflan.io/api/modules/root"
	users "github.com/roflan.io/api/modules/users"
	"github.com/roflan.io/environment"
	"github.com/roflan.io/external/telegram"
	"github.com/roflan.io/models"
	"github.com/roflan.io/pg"
	"github.com/roflan.io/pseudo"
	"log"
	"net/http"
	"os"
	"os/signal"
	"sync"
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
	var wg sync.WaitGroup
	wg.Add(2)
	pseudo.AddCode("+380935269398", true)
	go func() {
		for i := 0; i < 11; i++ {
			fmt.Println(pseudo.PSEUDO_ENTITY.CodeHandler["+380935269398"])
			time.Sleep(1 * time.Second)
		}
	}()
	go pg.InitializeFunctions(&wg)
	go pg.InitializeTables(&wg, &models.Models{})
	go telegram.NewTelegramHandler().
		Register(telegram.HandleUpdateUserChatId).
		Register(func(response tgbotapi.Update, bot *tgbotapi.BotAPI) error {
			fmt.Println(response, "two")
			update := response
			if update.Message != nil { // If we got a message
				fmt.Printf("[%s] %s", update.Message.From.UserName, update.Message.Text)

				msg := tgbotapi.NewMessage(update.Message.Chat.ID, "2134")
				//msg.ReplyToMessageID = update.Message.MessageID

				m, err := bot.Send(msg)
				fmt.Println(m, err)
			}
			return nil
		}).Connect()
	wg.Wait()
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
