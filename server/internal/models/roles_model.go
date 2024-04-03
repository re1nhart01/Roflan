package models

import (
	"fmt"
)

type RolesModel struct {
	*BaseModel
	Key                 string `json:"key"`
	ValueRepresentation string `json:"value_representation"`
}

// NewRolesTable insert into public.roles (key, value_representation) values ('test', 'test');
func (m *Models) NewRolesTable() string {
	return fmt.Sprintf(`
		CREATE TABLE IF NOT EXISTS %s (
	    %s
		key VARCHAR(50) NOT NULL UNIQUE,
		value_representation VARCHAR(500) NOT NULL 
	);
`, RolesTable, NewBaseModels())
}

func (RolesModel) TableName() string {
	return RolesTable
}
