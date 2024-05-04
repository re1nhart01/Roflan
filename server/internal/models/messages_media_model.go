package models

import "fmt"

type MessagesMediaModel struct {
	*BaseModel
	UserHashId    string `json:"user_hash_id"`
	FromMessageId string `json:"from_message_id"`
	FromFileId    string `json:"from_file_id"`
}

func (m *Models) NewMessagesMediaTable() string {
	return fmt.Sprintf(`
		CREATE TABLE IF NOT EXISTS %s (
	    %s
		user_hash_id VARCHAR(500) NOT NULL REFERENCES %s(user_hash),
		from_message_id VARCHAR(500) NOT NULL REFERENCES %s(message_id) ON DELETE CASCADE,
		from_file_id VARCHAR(500) NOT NULL REFERENCES %s(bucket_id) ON DELETE SET NULL,
		    UNIQUE(from_message_id, from_file_id)
	);
`, MessagesMediaTable, NewBaseModels(), UsersTable, MessagesTable, FilesTable)
}

func (MessagesMediaModel) TableName() string {
	return MessagesMediaTable
}
