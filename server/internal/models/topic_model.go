package models

import "fmt"

type TopicsModel struct {
	*BaseModel
	TopicHash    string `json:"topic_hash"`
	Name         string `json:"name"`
	AvatarBucket string `json:"avatar_bucket"`
	IsSingle     bool   `json:"is_single"`
	Active       bool   `json:"active"`
}

func (m *Models) NewTopicsModel() string {
	return fmt.Sprintf(`
		CREATE TABLE IF NOT EXISTS %s (
	    %s
		topic_hash VARCHAR(500) NOT NULL UNIQUE,
		name VARCHAR(250) NOT NULL DEFAULT 'New Chat',
		avatar_bucket VARCHAR(500) UNIQUE,
		is_single BOOLEAN DEFAULT true,
		active BOOLEAN DEFAULT true    
	);
`, TopicsTable, NewBaseModels())
}

func (TopicsModel) TableName() string {
	return TopicsTable
}
