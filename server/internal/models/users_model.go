package models

import (
	"fmt"
	"time"
)

type UsersModel struct {
	UserHash   string    `json:"user_hash"`
	Username   string    `json:"username"`
	FirstName  string    `json:"first_name"`
	LastName   string    `json:"last_name"`
	Patronymic string    `json:"patronymic"`
	Role       int       `json:"role"`
	Sex        string    `json:"sex"`
	University string    `json:"university"`
	Country    string    `json:"country"`
	City       string    `json:"city"`
	Active     bool      `json:"active"`
	Password   string    `json:"password"`
	Phone      string    `json:"phone"`
	Details    string    `json:"details"`
	Birthday   time.Time `json:"birthday"`
	*BaseModel
}

func (m *Models) NewUsersTable() string {
	return fmt.Sprintf(`CREATE TABLE IF NOT EXISTS %s (
	    %s
	    user_hash VARCHAR(500) NOT NULL UNIQUE,
    	username  VARCHAR(500) NOT NULL UNIQUE,
    	first_name VARCHAR(500) NOT NULL,
    	last_name VARCHAR(500) NOT NULL,
    	patronymic VARCHAR(500) NOT NULL,
    	role SERIAL NOT NULL REFERENCES %s(id) ON DELETE SET NULL,
    	sex VARCHAR(500) NOT NULL CHECK(sex IN %s),
    	phone VARCHAR(500) NOT NULL UNIQUE,
    	university VARCHAR(500),
    	details VARCHAR(2000),
    	country VARCHAR(500),
    	city VARCHAR(500),
    	active BOOLEAN DEFAULT TRUE,
    	password VARCHAR(500) NOT NULL,
    	birthday DATE NOT NULL DEFAULT CURRENT_DATE
	);
	    `, UsersTable, NewBaseModels(), RolesTable, SexTuples)
}

func (UsersModel) TableName() string {
	return UsersTable
}
