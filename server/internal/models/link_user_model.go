package models

import "fmt"

// 1 - link to favorites when is not private acc,
// 2 - link to favorite, when is private, and is accepted,
// 3 - banned

type LinkUserModel struct {
	*BaseModel
	FromUserHash string `json:"from_user_hash"`
	ToUserHash   string `json:"to_user_hash"`
	Operation    int    `json:"operation"`
}

func (m *Models) NewLinkUserModel() string {
	return fmt.Sprintf(`
		CREATE TABLE IF NOT EXISTS %s (
	    %s
		from_user_hash VARCHAR(50) NOT NULL REFERENCES %s(user_hash),
		to_user_hash VARCHAR(50) NOT NULL REFERENCES %s(user_hash),
		    UNIQUE(from_user_hash, to_user_hash)
	);
`, LinkUsers, NewBaseModels(), UsersTable, UsersTable)
}

func (LinkUserModel) TableName() string {
	return LinkUsers
}
