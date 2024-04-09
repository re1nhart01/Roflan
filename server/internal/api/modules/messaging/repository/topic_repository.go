package repository

import (
	"github.com/roflan.io/api/base"
)

type TopicsRepository struct {
	*base.Repository
}

func NewTopicsRepository() *TopicsRepository {
	return &TopicsRepository{
		Repository: &base.Repository{TableName: "topics"},
	}
}
