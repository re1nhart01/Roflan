package telegram

import (
	"fmt"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/roflan.io/environment"
	"github.com/roflan.io/external"
	"log"
)

type TGCallback func(response tgbotapi.Update, bot *tgbotapi.BotAPI) error
type Handler struct {
	handlers []TGCallback
}

func (handler *Handler) Connect() *Handler {
	apiKey := environment.GEnv().GetVariable("TELEGRAM_BOT_API_KEY")
	bot, err := tgbotapi.NewBotAPI(apiKey)
	if err != nil {
		log.Panic(err)
	}

	bot.Debug = true

	fmt.Printf("Authorized on account %s", bot.Self.UserName)

	u := tgbotapi.NewUpdate(0)
	u.Timeout = 60

	updates := bot.GetUpdatesChan(u)
	for update := range updates {
		for key, handlerFunc := range handler.handlers {
			if err := handlerFunc(update, bot); err != nil {
				fmt.Println(external.TelegramHandlerErrorOnCallback, "COUNT: ", key)
			}
		}
	}
	return handler
}

func (handler *Handler) SendMessageToSpecificUser(chatId int64, text string) error {
	apiKey := environment.GEnv().GetVariable("TELEGRAM_BOT_API_KEY")
	bot, err := tgbotapi.NewBotAPI(apiKey)
	if err != nil {
		log.Panic(err)
	}

	bot.Debug = true

	message := tgbotapi.NewMessage(chatId, text)
	_, err = bot.Send(message)
	return err
}

func (handler *Handler) Register(callback func(response tgbotapi.Update, bot *tgbotapi.BotAPI) error) *Handler {
	handler.handlers = append(handler.handlers, callback)
	return handler
}

func NewTelegramHandler() *Handler {
	return &Handler{
		handlers: []TGCallback{},
	}
}
