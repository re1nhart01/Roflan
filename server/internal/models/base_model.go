package models

import (
	"fmt"
	"time"
)

type Models struct {
}

type BaseModel struct {
	Id        int       `json:"id"`
	CreatedAt time.Time `json:"created_at,omitempty"`
	UpdatedAt time.Time `json:"updated_at,omitempty"`
	DeletedAt time.Time `json:"deleted_at,omitempty"`
}

func NewBaseModels() string {
	return fmt.Sprintf(`id SERIAL PRIMARY KEY,
 	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  	deleted_at TIMESTAMPTZ DEFAULT NULL,`)
}
