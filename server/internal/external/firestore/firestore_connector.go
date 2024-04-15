package firestore

import (
	"cloud.google.com/go/storage"
	"context"
	"fmt"
	"github.com/roflan.io/environment"
	"google.golang.org/api/option"
	"log"
	"os"

	_ "cloud.google.com/go/storage"

	firebase "firebase.google.com/go"
)

type FSCallback func(data map[string]any, bucket *storage.BucketHandle) error
type Handler struct {
	Bucket   *storage.BucketHandle
	handlers []FSCallback
}

func (handler *Handler) Connect() *Handler {
	bucketName := environment.GEnv().GetVariable("FIREBASE_BUCKET")
	pathToFile := environment.GEnv().GetVariable("FIREBASE_ADMINSDK_STORAGE")
	wd, _ := os.Getwd()
	config := &firebase.Config{
		StorageBucket: fmt.Sprintf("%s.appspot.com", bucketName),
	}
	fmt.Println(fmt.Sprintf("%s%s", wd, pathToFile))
	opt := option.WithCredentialsFile(fmt.Sprintf("%s%s", wd, pathToFile))
	app, err := firebase.NewApp(context.Background(), config, opt)
	if err != nil {
		log.Fatalln(err)
		return nil
	}

	client, err := app.Storage(context.Background())
	if err != nil {
		log.Fatalln(err)
		return nil
	}

	bucket, err := client.DefaultBucket()
	if err != nil {
		log.Fatalln(err)
		return nil
	}
	handler.Bucket = bucket
	return handler
}

func (handler *Handler) Register(callback FSCallback) *Handler {
	handler.handlers = append(handler.handlers, callback)
	return handler
}

func (handler *Handler) Emit(data map[string]any) error {
	for _, function := range handler.handlers {
		err := function(data, handler.Bucket)
		if err != nil {
			return err
		}
	}
	return nil
}

func NewFirestoreHandler() *Handler {
	return &Handler{
		handlers: []FSCallback{},
	}
}
