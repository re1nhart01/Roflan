package repository

import "github.com/roflan.io/api/base"

type MessageRepository struct {
	*base.Repository
}

func NewMessageRepository() *MessageRepository {
	return &MessageRepository{
		Repository: &base.Repository{TableName: "message"},
	}
}
