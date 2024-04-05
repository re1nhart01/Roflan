package api

import (
	"fmt"
	"github.com/roflan.io/api/base"
	"github.com/roflan.io/models"
	"github.com/roflan.io/pg"
)

type UserRepository struct {
	*base.Repository
}

func (user *UserRepository) CheckIsExistsByField(field, value string) bool {
	var existedModel models.UsersModel
	return pg.
		GDB().
		Instance.
		Table(models.UsersTable).
		Where(fmt.Sprintf("%s = ?", field), value).
		Find(&existedModel).
		RowsAffected > 0
}

func (user *UserRepository) SetTelegramIdByPhone(phone string, chatId string) error {
	var userModel models.UsersModel
	if err := pg.GDB().Instance.Table(models.UsersTable).Where("phone = ?", phone).Limit(1).Scan(&userModel); err.Error != nil {
		return err.Error
	}

	tgModel := models.TelegramIdsModel{
		UserHashId: userModel.UserHash,
		Phone:      phone,
		ChatId:     chatId,
	}

	if err := pg.GDB().Instance.Table(models.TelegramIdsTable).Create(&tgModel); err.Error != nil {
		return err.Error
	}
	return nil
}

func (user *UserRepository) GetUserByField(field, phone string) (models.UsersModel, error) {
	var result models.UsersModel

	if err := pg.GDB().Instance.Table(models.UsersTable).Where(fmt.Sprintf("%s = ?", field), phone).Limit(1).Scan(&result); err.Error != nil {
		return result, err.Error
	}

	return result, nil
}

func (user *UserRepository) GetTelegramIdsByLabel(label, value string) ([]models.TelegramIdsModel, error) {
	var result []models.TelegramIdsModel

	if err := pg.GDB().Instance.Table(models.TelegramIdsTable).Where(fmt.Sprintf("%s = ?", label), value).Scan(&result); err.Error != nil {
		return result, err.Error
	}

	return result, nil
}

func NewUsersRepository() *UserRepository {
	return &UserRepository{
		&base.Repository{TableName: "users"},
	}
}
