package models

import "fmt"

type TopicUsersModel struct {
	*BaseModel
	TopicHashId string `json:"topic_hash_id"`
	UserHashId  string `json:"user_hash_id"`
}

func (m *Models) NewTopicUsersTable() string {
	return fmt.Sprintf(`
		CREATE TABLE IF NOT EXISTS %s (
	    %s
		topic_hash_id VARCHAR(500) NOT NULL REFERENCES %s(topic_hash),
		user_hash_id VARCHAR(500) NOT NULL REFERENCES %s(user_hash),
		    UNIQUE(topic_hash_id, user_hash_id)
	);
`, TopicUsersTable, NewBaseModels(), TopicsTable, UsersTable)
}

func (TopicUsersModel) TableName() string {
	return LinkUsers
}
