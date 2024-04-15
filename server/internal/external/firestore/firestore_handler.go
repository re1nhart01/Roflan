package firestore

import (
	"cloud.google.com/go/storage"
	"context"
	"io"
	"log"
	"mime/multipart"
)

var ctx = context.Background()

func HandleAddNewFileToBucket(data map[string]any, bucket *storage.BucketHandle) error {
	obj := bucket.Object(data["dest"].(string))
	writer := obj.NewWriter(ctx)
	file := data["file"].(*multipart.File)
	_, err := io.Copy(writer, *file)

	if err != nil {
		log.Fatalf("Failed to upload file to Firebase Storage: %v", err)
		return err
	}

	if err := writer.Close(); err != nil {
		log.Fatalf("Failed to close Firebase Storage writer: %v", err)
		return err
	}
	return nil
}

func HandleRemoveFileFromBucket(data map[string]any, bucket *storage.BucketHandle) error {
	obj := bucket.Object(data["bucketId"].(string))
	if err := obj.Delete(ctx); err != nil {
		return err
	}
	return nil
}
