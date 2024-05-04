package repository

import (
	"github.com/roflan.io/api/base"
	"github.com/roflan.io/crypto"
	"github.com/roflan.io/environment"
	. "github.com/roflan.io/helpers"
	"github.com/roflan.io/models"
	"github.com/roflan.io/paginator"
	"github.com/roflan.io/pg"
	"gorm.io/gorm"
	"sync"
	"time"
)

type MessageRepository struct {
	*base.Repository
}

var wg *sync.WaitGroup

// status 0 - помилка
// status 1 - відправлено
// status 2 - доставлено
// status 3 - прочитано

const (
	ErrorMessageStatus = iota
	SentMessageStatus
	DeliveredMessageStatus
	ReadMessageStatus
)

func (repo *MessageRepository) retrieveMessageMediaItems(tx *gorm.DB, messageId string) *gorm.DB {
	return tx.
		Table(models.MessagesMediaTable).
		Where("from_message_id = ?", messageId).
		Joins("left join (select * from files) as f on messages_media.from_file_id = f.bucket_id")
}

func (repo *MessageRepository) retrieveMessageFromUser(tx *gorm.DB, userHash string) *gorm.DB {
	return tx.Table(models.UsersTable).
		Where("user_hash = ?", userHash).
		Select(
			[]string{
				"username",
				"first_name",
				"last_name",
				"patronymic",
				"role",
				"details",
				"university",
				"user_hash",
			})
}

func (repo *MessageRepository) BulkReadMessages(queries map[string][]string) (paginator.ObjectPaginator, error) {
	result := paginator.NewObjectPaginator()

	if err := paginator.NewPaginator().STable(models.MessagesTable).SAcceptedFilter([]string{"topic_hash_id"}).Pick(queries).Ignite(&result); err != nil {
		return result, err
	}

	if err := paginator.MergeTo[[]map[string]any](&result, "media", func(item map[string]any, tx *gorm.DB) *gorm.DB {
		return repo.retrieveMessageMediaItems(tx, S(item["message_id"]))

	}); err != nil {
		return result, err
	}

	if err := paginator.MergeTo[map[string]any](&result, "user_owner", func(item map[string]any, tx *gorm.DB) *gorm.DB {
		return repo.retrieveMessageFromUser(tx, S(item["user_hash_id"]))
	}); err != nil {
		return result, err
	}

	return result, nil
}

func (repo *MessageRepository) AddMessage(userHash, topicHash, body string, mediaIds []string) (*models.MessageModelFull, error) {
	messageId := crypto.MakePasswordHash(
		crypto.GenerateRecreatableString([]string{userHash, topicHash, time.Now().String()}),
		environment.GEnv().GetVariable("SERVER_KEY"),
	)

	echoModel := models.MessageModelFull{
		BaseModel:   nil,
		UserHashId:  userHash,
		TopicHashId: topicHash,
		Body:        body,
		MessageId:   messageId,
		WithMedia:   len(mediaIds) > 0,
	}

	if err := pg.GDB().Instance.Transaction(func(tx *gorm.DB) error {
		if payload := tx.Table(models.MessagesTable).Create(&echoModel); payload.Error != nil {
			return payload.Error
		}

		if len(mediaIds) > 0 {
			var mediaList []models.MessagesMediaModel

			for _, v := range mediaIds {
				mediaList = append(mediaList, models.MessagesMediaModel{
					UserHashId:    userHash,
					FromMessageId: messageId,
					FromFileId:    v,
				})
			}

			if payload := tx.Table(models.MessagesMediaTable).Create(&mediaList); payload.Error != nil {
				return payload.Error
			}
		}

		return nil
	}); err != nil {
		return &echoModel, err
	}

	if payload := repo.retrieveMessageMediaItems(pg.GDB().Instance, messageId).Scan(&echoModel.Media); payload.Error != nil {
		return &echoModel, payload.Error
	}

	if payload := repo.retrieveMessageFromUser(pg.GDB().Instance, userHash).Take(&echoModel.UserOwner); payload.Error != nil {
		return &echoModel, payload.Error
	}

	return &echoModel, nil
}

func NewMessageRepository() *MessageRepository {
	return &MessageRepository{
		Repository: &base.Repository{TableName: "message"},
	}
}
