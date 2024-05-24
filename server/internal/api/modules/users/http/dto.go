package api

import "github.com/roflan.io/dto"

var UpdateUserFieldDto = &dto.FieldsMapping{
	"username": &dto.FieldDto{
		Type:     "STRING",
		Required: false,
		Min:      5,
		Max:      100,
		Name:     "username",
	},
	"password": &dto.FieldDto{
		Type:     "STRING",
		Required: false,
		Min:      5,
		Max:      100,
		Name:     "password",
	},
	"firstName": &dto.FieldDto{
		Type:     "STRING",
		Required: false,
		Min:      5,
		Max:      100,
		Name:     "firstName",
	},
	"lastName": &dto.FieldDto{
		Type:     "STRING",
		Required: false,
		Min:      5,
		Max:      100,
		Name:     "lastName",
	},
	"patronymic": &dto.FieldDto{
		Type:     "STRING",
		Required: false,
		Min:      5,
		Max:      100,
		Name:     "patronymic",
	},
	"role": &dto.FieldDto{
		Type:     "INTEGER",
		Required: false,
		Min:      0,
		Max:      10,
		Name:     "role",
	},
	"phone": &dto.FieldDto{
		Type:     "STRING",
		Required: false,
		Min:      5,
		Max:      100,
		Name:     "phone",
	},
	"sex": &dto.FieldDto{
		Type:       "STRING",
		Required:   false,
		Min:        4,
		Max:        100,
		Name:       "sex",
		AcceptOnly: []any{"male", "female", "other"},
	},
	"city": &dto.FieldDto{
		Type:     "STRING",
		Required: false,
		Min:      5,
		Max:      100,
		Name:     "city",
	},
	"country": &dto.FieldDto{
		Type:     "STRING",
		Required: false,
		Min:      5,
		Max:      100,
		Name:     "country",
	},
	"details": &dto.FieldDto{
		Type:     "STRING",
		Required: false,
		Min:      5,
		Max:      100,
		Name:     "details",
	},
	"university": &dto.FieldDto{
		Type:     "STRING",
		Required: false,
		Min:      5,
		Max:      100,
		Name:     "details",
	},
}

var UpdatePreferencesFieldDto = &dto.FieldsMapping{
	"": &dto.FieldDto{},
}
