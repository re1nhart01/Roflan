package models

import "fmt"

type TelegramIdsModel struct {
	UserHashId string `json:"user_hash_id"`
	Phone      string `json:"phone"`
	ChatId     string `json:"chat_id"`
	*BaseModel
}

func (m *Models) NewTelegramIdsTable() string {
	return fmt.Sprintf(`CREATE TABLE IF NOT EXISTS %s (
    	%s
        user_hash_id VARCHAR(200) NOT NULL UNIQUE REFERENCES %s(user_hash) ON DELETE CASCADE,
    	phone VARCHAR(500) REFERENCES %s(phone) NOT NULL,
    	chat_id VARCHAR(200) NOT NULL,
    	UNIQUE(phone, chat_id)
    )`, TelegramIdsTable, NewBaseModels(), UsersTable, UsersTable)
}
