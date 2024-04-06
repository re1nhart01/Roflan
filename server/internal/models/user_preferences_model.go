package models

import "fmt"

type UserPreferencesModel struct {
	UserHashId            string `json:"user_hash_id"`
	Theme                 string `json:"theme"`
	Lang                  string `json:"lang"`
	DisabledNotifications bool   `json:"disabled_notifications"`
	*BaseModel
}

func (m *Models) NewUserPreferencesTable() string {
	return fmt.Sprintf(`CREATE TABLE IF NOT EXISTS %s (
    	%s
        user_hash_id VARCHAR(200) NOT NULL UNIQUE REFERENCES %s(user_hash) ON DELETE CASCADE,
    	theme VARCHAR(150) NOT NULL DEFAULT 'default',
		lang VARCHAR(4) NOT NULL DEFAULT 'en',
    	disabled_notifications BOOLEAN NOT NULL DEFAULT false
    )`, UserPreferencesTable, NewBaseModels(), UsersTable)
}
