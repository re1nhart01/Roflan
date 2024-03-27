package models

import (
	"fmt"
	"github.com/roflan.io/api"
)

type RolesModel struct {
	*BaseModel
	Key                 string `json:"key"`
	ValueRepresentation string `json:"value_representation"`
}

func NewRolesTable() string {
	return fmt.Sprintf(`
		CREATE TABLE IF NOT EXISTS %s 
	(
	    %s
		key VARCHAR(50) NOT NULL UNIQUE,
		value_representation VARCHAR(500) NOT NULL,    
	)
`, api.RolesTable, NewBaseModels())
}

func (RolesModel) TableName() string {
	return api.RolesTable
}
