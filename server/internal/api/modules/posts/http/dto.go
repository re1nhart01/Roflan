package http

import "github.com/roflan.io/dto"

var AddPostDto = &dto.FieldsMapping{
	"content_text": &dto.FieldDto{
		Type:     "STRING",
		Required: true,
		Min:      0,
		Max:      5000,
		Name:     "content_text",
	},
	"files_ids": &dto.FieldDto{
		Type:      "ARRAY",
		Required:  true,
		Name:      "files_ids",
		MaxLength: 20,
		MinLength: 1,
	},
}
