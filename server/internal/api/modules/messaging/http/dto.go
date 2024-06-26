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

var AddMessageDto = &dto.FieldsMapping{
	"topicHash": &dto.FieldDto{
		Type:     "STRING",
		Required: true,
		Min:      5,
		Max:      250,
		Name:     "topicHash",
	},
	"body": &dto.FieldDto{
		Type:     "STRING",
		Required: true,
		Min:      0,
		Max:      5000,
		Name:     "body",
	},
	"mediaIds": &dto.FieldDto{
		Type:      "ARRAY",
		Required:  true,
		MinLength: 0,
		MaxLength: 10,
		Name:      "mediaIds",
	},
}

var UpdateTopicDto = &dto.FieldsMapping{
	"topicHash": &dto.FieldDto{
		Type:     "STRING",
		Required: true,
		Min:      5,
		Max:      250,
		Name:     "topicHash",
	},
	"userIds": &dto.FieldDto{
		Type:      "ARRAY",
		Required:  true,
		MinLength: 0,
		MaxLength: 50,
		Name:      "userIds",
	},
	"name": &dto.FieldDto{
		Type:         "STRING",
		Required:     true,
		Min:          5,
		Max:          80,
		DefaultValue: "New Chat",
		Name:         "name",
	},
	"avatarBucket": &dto.FieldDto{
		Type:     "STRING",
		Required: true,
		Min:      5,
		Max:      250,
		Name:     "avatarBucket",
	},
}
