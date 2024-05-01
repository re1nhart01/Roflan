package http

import "github.com/roflan.io/dto"

var AddTopicDto = &dto.FieldsMapping{
	"name": &dto.FieldDto{
		Type:         "STRING",
		Required:     true,
		Min:          5,
		Max:          80,
		DefaultValue: "New Chat",
		Name:         "name",
	},
	"isSingle": &dto.FieldDto{
		Type:     "BOOL",
		Required: true,
		Name:     "isSingle",
	},
	"avatarBucket": &dto.FieldDto{
		Type:     "STRING",
		Required: true,
		Min:      5,
		Max:      250,
		Name:     "avatarBucket",
	},
	"userIds": &dto.FieldDto{
		Type:      "ARRAY",
		Required:  true,
		MinLength: 0,
		MaxLength: 50,
		Name:      "userIds",
	},
}
