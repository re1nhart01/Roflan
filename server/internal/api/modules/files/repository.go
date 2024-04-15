package api

import (
	"github.com/roflan.io/api/base"
	api "github.com/roflan.io/api/modules/users"
	"github.com/roflan.io/crypto"
	"github.com/roflan.io/environment"
	"github.com/roflan.io/external/firestore"
	"github.com/roflan.io/helpers"
	"github.com/roflan.io/models"
	"github.com/roflan.io/pg"
	"mime/multipart"
	"strconv"
	"sync"
	"time"
)

type FilesRepository struct {
	*base.Repository
	*api.UserRepository
}

var wg sync.WaitGroup

func (repo *FilesRepository) GenerateUniqueFileName(userHash string, serverFileName string) string {
	serverHash := environment.GEnv().GetVariable("SERVER_KEY")
	generatedHash := crypto.GetSha1(serverHash, userHash+strconv.Itoa(int(time.Now().Unix())))
	extension := helpers.GetFileExtensionFromFile(serverFileName)
	return generatedHash + "." + extension
}

func (repo *FilesRepository) AddFile(userHash string, files []*multipart.FileHeader) error {
	updater := firestore.NewFirestoreHandler().Connect().Register(firestore.HandleAddNewFileToBucket)
	errCh := make(chan error)
	wg.Add(len(files))
	for _, v := range files {
		go repo.ProcessSingleFile(userHash, errCh, v, updater)
	}
	wg.Wait()
	return <-errCh
}

func (repo *FilesRepository) ProcessSingleFile(userHash string, errChannel chan error, file *multipart.FileHeader, updater *firestore.Handler) {
	openedFile, err := file.Open()
	defer openedFile.Close()
	fileName := repo.GenerateUniqueFileName(userHash, file.Filename)

	if err = updater.Emit(map[string]any{
		"dest": fileName,
		"file": &openedFile,
	}); err != nil {
		errChannel <- err
	}

	model := models.FileModel{
		FileName:      file.Filename,
		OwnerUserHash: userHash,
		BucketId:      fileName,
	}
	d := pg.GDB().Instance.Table(models.FilesTable).Create(&model)
	if d.Error != nil {
		errChannel <- d.Error
	}
	wg.Done()
	errChannel <- nil
}

func NewFilesRepository() *FilesRepository {
	return &FilesRepository{
		Repository:     &base.Repository{TableName: "files"},
		UserRepository: api.NewUsersRepository(),
	}
}
