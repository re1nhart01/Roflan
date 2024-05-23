package repository

import (
	"encoding/base64"
	"errors"
	"fmt"
	"github.com/roflan.io/api/base"
	"github.com/roflan.io/crypto"
	"github.com/roflan.io/helpers"
	"github.com/roflan.io/models"
	"github.com/roflan.io/paginator"
	"github.com/roflan.io/pg"
	"gorm.io/gorm"
	"time"
)

type TopicsRepository struct {
	*base.Repository
}

func (repo *TopicsRepository) retrieveUsersForTopic(tx *gorm.DB, topicHash string) *gorm.DB {
	return tx.Table(models.TopicUsersTable).
		Where("topic_hash_id = ?", topicHash).
		Joins(`left join (select 
						user_hash, 
						first_name,
						last_name,	
						patronymic,	
						username,
						role,
						university,
						city,
						country,
						details,
						birthday,
						phone from users) as u on u.user_hash = topic_users.user_hash_id`)
}

func (repo *TopicsRepository) GetBulkTopics(userHash string, queries map[string][]string) (paginator.ObjectPaginator, error) {
	result := paginator.NewObjectPaginator()

	pager := paginator.NewPaginator()

	if err := pager.
		STable(models.TopicUsersTable).
		SUser(fmt.Sprintf("user_hash_id = '%s'", userHash)).
		Pick(queries).
		SJoin("left join (select * from topics) as t on topic_users.topic_hash_id = t.topic_hash").
		Ignite(&result); err != nil {
		fmt.Println(err)
		return result, errors.New("paginator error")
	}

	if err := paginator.MergeTo[[]map[string]any](&result, "users", func(item map[string]any, tx *gorm.DB) *gorm.DB {
		return repo.retrieveUsersForTopic(tx, item["topic_hash"].(string))
	}); err != nil {
		fmt.Println(err.Error())
		return result, errors.New("paginator error 1")
	}

	return result, nil
}

func (repo *TopicsRepository) GetTopic(topicHash string) (map[string]any, error) {
	var result map[string]any
	var users []map[string]any

	if payload := pg.GDB().Instance.Table(models.TopicsTable).Where("topic_hash = ?", topicHash).Scan(&result); payload.Error != nil {
		return map[string]any{}, nil
	}

	if payload := repo.retrieveUsersForTopic(pg.GDB().Instance, topicHash).Scan(&users); payload.Error != nil {
		return map[string]any{}, nil
	}

	result["users"] = users

	return result, nil
}

func (repo *TopicsRepository) CreateOrReceiveTopic(userHash, name string, isSingle bool, avatarBucket string, userIds []any) (map[string]any, error) {
	if len(userIds) <= 0 {
		return map[string]any{}, errors.New("list is empty")
	}
	fullUsersList := append(helpers.AnyToStringSlice(userIds), userHash)
	computedHash := crypto.MakePasswordHash(crypto.GenerateRecreatableString(fullUsersList), map[bool]string{
		false: base64.StdEncoding.EncodeToString([]byte(time.Now().String())),
		true:  "",
	}[isSingle])

	topic := models.TopicsModel{
		TopicHash:    computedHash,
		Name:         name,
		AvatarBucket: avatarBucket,
		IsSingle:     isSingle,
		Active:       true,
	}

	if repo.CheckIsTopicExists(computedHash) {
		return repo.GetTopic(computedHash)
	}

	if payloadTsc := pg.GDB().Instance.Transaction(func(tx *gorm.DB) error {
		if payload := tx.Table(models.TopicsTable).Create(&topic); payload.Error != nil {
			return errors.New("on topic creation error")
		}

		for _, v := range fullUsersList {
			model := models.TopicUsersModel{
				TopicHashId: computedHash,
				UserHashId:  v,
			}
			if payload := tx.Table(models.TopicUsersTable).Create(&model); payload.Error != nil {
				return errors.New("error on users creation")
			}
		}
		return nil
	}); payloadTsc != nil {
		return map[string]any{}, payloadTsc
	}

	return repo.GetTopic(computedHash)
}

func (repo *TopicsRepository) CheckIsTopicExists(hash string) bool {
	result := new(int64)

	if payload := pg.GDB().Instance.Table(models.TopicsTable).Where("topic_hash = ?", hash).Count(result); payload.Error != nil {
		return true
	}
	return *result == 1
}

func NewTopicsRepository() *TopicsRepository {
	return &TopicsRepository{
		Repository: &base.Repository{TableName: "topics"},
	}
}
