package http

import "github.com/roflan.io/dto"

var AddFile = &dto.FieldsMapping{
	"files": &dto.FieldDto{
		Type:     "MULTIPART_FILE",
		Required: true,
		Name:     "files",
		Body: map[string]*dto.FieldDto{
			"files": &dto.FieldDto{
				Name: "files",
			},
		},
	},
	"values": &dto.FieldDto{
		Type:     "MULTIPART_VALUES",
		Required: true,
		Name:     "values",
		Body: map[string]*dto.FieldDto{
			"bruh": &dto.FieldDto{
				Name: "bruh",
			},
		},
	},
}

var RemoveFileDto = &dto.FieldsMapping{
	"ids": &dto.FieldDto{
		Type:      "ARRAY",
		Required:  true,
		Name:      "ids",
		MaxLength: 20,
		MinLength: 1,
	},
}
