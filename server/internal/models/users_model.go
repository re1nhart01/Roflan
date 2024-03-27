package models

import (
	"fmt"
	"github.com/roflan.io/api"
)

type UsersModel struct {
	*BaseModel
	UserHash    string `json:"user_hash"`
	Username    string `json:"username"`
	FirstName   string `json:"first_name"`
	LastName    string `json:"last_name"`
	Patronymic  string `json:"patronymic"`
	Role        string `json:"role"`
	Description string `json:"description"`
	Sex         string `json:"sex"`
	University  string `json:"university"`
	Country     string `json:"country"`
	City        string `json:"city"`
	Active      bool   `json:"active"`
	Password    string `json:"password"`
}

func NewUsersTable() string {
	return fmt.Sprintf(`CREATE TABLE IF NOT EXISTS %s 
	(
	    %s
	    user_hash VARCHAR(500) NOT NULL UNIQUE,
    	username  VARCHAR(500) NOT NULL UNIQUE,
    	first_name VARCHAR(500) NOT NULL,
    	last_name VARCHAR(500) NOT NULL,
    	patronymic VARCHAR(500) NOT NULL,
    	role SERIAL NOT NULL REFERENCES %s(id) ON DELETE SET NULL,
    	sex VARCHAR(500) NOT NULL CHECK(sex IN %s),
    	university VARCHAR(500),
    	country VARCHAR(500),
    	city VARCHAR(500),
    	active BOOLEAN DEFAULT TRUE,
    	password VARCHAR(500) NOT NULL,
	)
	    `, api.UsersTable, NewBaseModels(), api.SexTuples, api.RolesTable)
}

func (UsersModel) TableName() string {
	return api.UsersTable
}
