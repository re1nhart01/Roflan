package models

import "fmt"

type MessageModel struct {
	*BaseModel
	UserHashId    string `json:"user_hash_id"`
	TopicHashId   string `json:"topic_hash_id"`
	MessageId     string `json:"message_id"`
	Body          string `json:"body"`
	WithMedia     bool   `json:"with_media"`
	MessageStatus uint8  `json:"message_status" gorm:"type:integer"`
}

type MessageModelFull struct {
	*BaseModel
	UserHashId    string           `json:"user_hash_id"`
	TopicHashId   string           `json:"topic_hash_id"`
	Body          string           `json:"body"`
	MessageId     string           `json:"message_id"`
	WithMedia     bool             `json:"with_media"`
	MessageStatus uint8            `json:"message_status"`
	Media         []map[string]any `json:"media" gorm:"embedded"`
	UserOwner     map[string]any   `json:"user_owner" gorm:"embedded"`
}

func (m *Models) NewMessagesTable() string {
	return fmt.Sprintf(`
		CREATE TABLE IF NOT EXISTS %s (
	    %s
		user_hash_id VARCHAR(500) NOT NULL REFERENCES %s(user_hash),
		topic_hash_id VARCHAR(500) NOT NULL REFERENCES %s(topic_hash) ON DELETE CASCADE,
		message_id VARCHAR(500) NOT NULL UNIQUE,
		body VARCHAR(5000),   
		with_media BOOLEAN DEFAULT false,    
		message_status INTEGER DEFAULT 0 CHECK(message_status >= 0),
		UNIQUE(user_hash_id, message_id)    
	); 
`, MessagesTable, NewBaseModels(), UsersTable, TopicsTable)
}

func (MessageModel) TableName() string {
	return RolesTable
}
