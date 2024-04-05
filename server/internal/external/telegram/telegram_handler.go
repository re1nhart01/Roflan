package telegram

import (
	"fmt"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	api "github.com/roflan.io/api/modules/users"
	"github.com/roflan.io/helpers"
	"github.com/roflan.io/models"
	"strconv"
	"strings"
)

func HandleUpdateUserChatId(response tgbotapi.Update, bot *tgbotapi.BotAPI) error {
	userRepo := api.NewUsersRepository()
	update := response
	if update.Message != nil { // If we got a message
		str := strings.TrimSpace(update.Message.Text)
		if strings.HasPrefix(str, "/register") && helpers.HasPhoneNumber(update.Message.Text) {
			splittedString := strings.Split(update.Message.Text, " ")
			if err := userRepo.SetTelegramIdByPhone(splittedString[1], strconv.FormatInt(update.Message.Chat.ID, 10)); err != nil {
				msg := tgbotapi.NewMessage(update.Message.Chat.ID, "User is already registered or unhandled error caught")
				bot.Send(msg)
				return err
			}
			msg := tgbotapi.NewMessage(update.Message.Chat.ID, "User is successfully registered!")
			bot.Send(msg)
		}
	}
	return nil
}

func SendCodesToUserIds(telegramIds []models.TelegramIdsModel, verificationString, code string) error {
	handler := NewTelegramHandler()
	for _, v := range telegramIds {
		chatIdInt, _ := strconv.Atoi(v.ChatId)
		if err := handler.SendMessageToSpecificUser(int64(chatIdInt), fmt.Sprintf(verificationString, v.Phone, code)); err != nil {
			return err
		}
	}
	return nil
}
