package api

import (
	"errors"
	"github.com/roflan.io/api/base"
	"github.com/roflan.io/crypto"
	"github.com/roflan.io/environment"
	"github.com/roflan.io/models"
	"github.com/roflan.io/paginator"
	"github.com/roflan.io/pg"
	"gorm.io/gorm"
	"strconv"
	"time"
)

type PostsRepository struct {
	*base.Repository
}

func (repo *PostsRepository) GetBulkPosts(queries map[string][]string) (paginator.ObjectPaginator, error) {
	result := paginator.NewObjectPaginator()

	pager := paginator.NewPaginator()

	if err := pager.STable(models.PostsTable).Pick(queries).SAcceptedFilter([]string{"user_hash_id"}).Ignite(&result); err != nil {
		return result, err
	}

	if err := paginator.MergeTo[[]*models.PostsFilesFullModel](&result, "files", func(item map[string]any, tx *gorm.DB) *gorm.DB {
		return pg.
			GDB().
			Instance.
			Table(models.PostsFilesTable).
			Where("posts_post_id = ?", item["post_id"].(string)).
			Joins("left join (select * from files) as f on posts_files.storage_bucket_id = f.bucket_id")
	}); err != nil {
		return result, err
	}

	return result, nil
}

func (repo *PostsRepository) AddPost(userHash, contentText string, filesIds []any) error {
	var linkedFiles []*models.PostsFilesModel
	postId := crypto.GetSha1(environment.GEnv().GetVariable("SERVER_KEY"), userHash+strconv.Itoa(int(time.Now().Unix())))
	resultPost := models.PostsModel{
		UserHashId:  userHash,
		ContentText: contentText,
		PostId:      postId,
	}

	if err := pg.GDB().Instance.Transaction(func(tx *gorm.DB) error {
		if payload := tx.Table(models.PostsTable).Create(&resultPost); payload.Error != nil {
			return payload.Error
		}
		for k, fileId := range filesIds {
			isPrimary := k == 0
			linkedFiles = append(linkedFiles, &models.PostsFilesModel{
				PostsPostId:     postId,
				StorageBucketId: fileId.(string),
				IsMain:          isPrimary,
			})
		}
		if payload := tx.Table(models.PostsFilesTable).Create(&linkedFiles); payload.Error != nil {
			return payload.Error
		}
		return nil
	}); err != nil {
		return err
	}

	return nil
}

func (repo *PostsRepository) RemovePost(postId string) error {
	return nil
}

func (repo *PostsRepository) LinkFileToPost(postId, fileId string, isMain bool) error {
	result := models.PostsFilesModel{
		PostsPostId:     postId,
		StorageBucketId: fileId,
		IsMain:          isMain,
	}
	if payload := pg.GDB().Instance.Table(models.PostsFilesTable).Create(&result); payload.Error != nil {
		return errors.New("can not link file for post")
	}
	return nil
}

func NewPostsRepository() *PostsRepository {
	return &PostsRepository{
		&base.Repository{TableName: "posts"},
	}
}
