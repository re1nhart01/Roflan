package fs

import (
	"fmt"
	"io"
	"mime/multipart"
	"os"
)

func ReadJSONFile[T comparable](path string) {
	fmt.Println("STUB!")
}

func GenerateOsFileFromMultipart(file multipart.File, header multipart.FileHeader) (string, *os.File, error) {
	tempFile, err := os.Create(header.Filename)

	if err != nil {
		fmt.Println(err, 1)
		return "", nil, err
	}
	if _, err = io.Copy(tempFile, file); err != nil {
		fmt.Println(err, 2)
		return "", nil, err
	}

	return tempFile.Name(), tempFile, nil
}
