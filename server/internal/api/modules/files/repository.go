package api

import (
	"errors"
	"fmt"
	"github.com/roflan.io/api/base"
	api "github.com/roflan.io/api/modules/users"
	"github.com/roflan.io/crypto"
	"github.com/roflan.io/environment"
	"github.com/roflan.io/external/firestore"
	"github.com/roflan.io/helpers"
	"github.com/roflan.io/models"
	"github.com/roflan.io/paginator"
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

func (repo *FilesRepository) BulkGetFiles(userHash string, queries map[string][]string) (paginator.ObjectPaginator, error) {
	result := paginator.NewObjectPaginator()

	pager := paginator.NewPaginator()

	if err := pager.
		STable(models.FilesTable).
		Pick(queries).
		SUser(fmt.Sprintf("owner_user_hash = '%s'", userHash)).
		Ignite(&result); err != nil {
		return result, err
	}

	return result, nil
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

func (repo *FilesRepository) BulkRemoveFile(userHash string, ids []any) error {
	updater := firestore.NewFirestoreHandler().Connect().Register(firestore.HandleRemoveFileFromBucket)

	errCh := make(chan error)
	wg.Add(len(ids))

	db := pg.GDB().Instance.Table(models.FilesTable)

	for k, v := range ids {
		go func(ch chan error, value any, index int) {
			if err := db.Where("owner_user_hash = ? AND bucket_id = ?", userHash, value).Delete(&models.FileModel{}); err.Error != nil {
				errCh <- err.Error
			} else {
				if err.RowsAffected == 0 {
					errCh <- errors.New("Invalid file")
				}
			}

			if err := updater.Emit(map[string]any{
				"bucketId": value,
				"index":    index,
			}); err != nil {
				errCh <- err
			}

			defer wg.Done()
			errCh <- nil
		}(errCh, v, k)
	}

	if err := <-errCh; err != nil {
		return err
	}

	return nil
}

func NewFilesRepository() *FilesRepository {
	return &FilesRepository{
		Repository:     &base.Repository{TableName: "files"},
		UserRepository: api.NewUsersRepository(),
	}
}
