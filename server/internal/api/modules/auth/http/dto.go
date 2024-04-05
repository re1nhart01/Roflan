package api

import "github.com/roflan.io/dto"

var AuthRegisterDto = &dto.FieldsMapping{
	"username": &dto.FieldDto{
		Type:     "STRING",
		Required: true,
		Min:      5,
		Max:      100,
		Name:     "username",
	},
	"password": &dto.FieldDto{
		Type:     "STRING",
		Required: true,
		Min:      5,
		Max:      100,
		Name:     "password",
	},
	"firstName": &dto.FieldDto{
		Type:     "STRING",
		Required: true,
		Min:      5,
		Max:      100,
		Name:     "firstName",
	},
	"lastName": &dto.FieldDto{
		Type:     "STRING",
		Required: true,
		Min:      5,
		Max:      100,
		Name:     "lastName",
	},
	"patronymic": &dto.FieldDto{
		Type:     "STRING",
		Required: true,
		Min:      5,
		Max:      100,
		Name:     "patronymic",
	},
	"role": &dto.FieldDto{
		Type:     "INTEGER",
		Required: true,
		Min:      0,
		Max:      10,
		Name:     "role",
	},
	"phone": &dto.FieldDto{
		Type:     "STRING",
		Required: true,
		Min:      5,
		Max:      100,
		Name:     "phone",
	},
	"sex": &dto.FieldDto{
		Type:       "STRING",
		Required:   true,
		Min:        4,
		Max:        100,
		Name:       "sex",
		AcceptOnly: []any{"male", "female", "other"},
	},
}

var LoginDto = &dto.FieldsMapping{
	"phone": &dto.FieldDto{
		Type:     "STRING",
		Required: true,
		Min:      5,
		Max:      100,
		Name:     "phone",
	},
	"password": &dto.FieldDto{
		Type:     "STRING",
		Required: true,
		Min:      5,
		Max:      100,
		Name:     "password",
	},
}

var ValidateCodeDto = &dto.FieldsMapping{
	"code": &dto.FieldDto{
		Type:     "STRING",
		Required: true,
		Min:      5,
		Max:      6,
		Name:     "code",
	},
	"phone": &dto.FieldDto{
		Type:     "STRING",
		Required: true,
		Min:      5,
		Max:      100,
		Name:     "phone",
	},
}

var AuthCheckPhoneDto = &dto.FieldsMapping{
	"phone": &dto.FieldDto{
		Type:     "STRING",
		Required: true,
		Min:      5,
		Max:      100,
		Name:     "phone",
	},
}

var UpdateTokenDto = &dto.FieldsMapping{
	"refresh_token": &dto.FieldDto{
		Type:     "STRING",
		Required: true,
		Min:      100,
		Max:      300,
		Name:     "refresh_token",
	},
}
