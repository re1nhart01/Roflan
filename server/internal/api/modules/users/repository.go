package api

import (
	"fmt"
	"github.com/roflan.io/api/base"
	"github.com/roflan.io/crypto"
	"github.com/roflan.io/helpers"
	"github.com/roflan.io/models"
	"github.com/roflan.io/paginator"
	"github.com/roflan.io/pg"
)

type UserRepository struct {
	*base.Repository
}

func (user *UserRepository) CreateDefaultPreferences(userHash string) error {
	return pg.
		GDB().
		Instance.Table(models.UserPreferencesTable).Create(&models.UserPreferencesModel{
		UserHashId:            userHash,
		Theme:                 models.DefaultTheme,
		Lang:                  models.LocaleEN,
		DisabledNotifications: false,
	}).Error
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

func (user *UserRepository) GetPaginatedUserList(queries map[string][]string) (paginator.ObjectPaginator, error) {
	result := paginator.NewObjectPaginator()

	pager := paginator.NewPaginator()

	if err := pager.STable(models.UsersTable).SSelect([]string{
		"phone",
		"id",
		"user_hash",
		"username",
		"first_name",
		"last_name",
		"patronymic",
		"role",
		"sex",
		"university",
		"details",
		"country",
		"city",
		"active",
		"birthday",
	}).Pick(queries).Ignite(&result); err != nil {
		return result, err
	}
	return result, nil
}

func (user *UserRepository) UpdateAndTransformField(userHash string, fields map[string]any) (map[string]any, error) {
	consultationToUpdate := map[string]any{}
	updatableFields := map[string]func(v any) any{
		"username": func(v any) any { return v },
		"first_name": func(v any) any {
			return helpers.Capitalize(v.(string))
		},
		"last_name": func(v any) any {
			return helpers.Capitalize(v.(string))
		},
		"patronymic": func(v any) any {
			return helpers.Capitalize(v.(string))
		},
		"role":       func(v any) any { return v },
		"sex":        func(v any) any { return v },
		"university": func(v any) any { return v },
		"details":    func(v any) any { return v },
		"country":    func(v any) any { return v },
		"password": func(v any) any {
			hashedPassword := crypto.HashPassword(v.(string))
			return hashedPassword
		},
		"city":     func(v any) any { return v },
		"active":   func(v any) any { return v },
		"birthday": func(v any) any { return v },
	}
	//filtering
	for k, _ := range fields {
		if updatableFields[k] != nil {
			consultationToUpdate[k] = updatableFields[k](fields[k])
		}
	}

	userBefore, err := user.ReadUserData(userHash)
	if err != nil {
		return fields, err
	}

	if payload := pg.GDB().Instance.Table(models.UsersTable).Where("user_hash = ?", userHash).Updates(consultationToUpdate); payload.Error != nil {
		return userBefore, payload.Error
	}

	userAfter, err := user.ReadUserData(userHash)
	if err != nil {
		return userBefore, err
	}

	return userAfter, nil
}

func (user *UserRepository) ReadUserData(userHash string) (map[string]any, error) {
	model := map[string]any{}

	if err := pg.
		GDB().
		Instance.
		Table(models.UsersTable).
		Where("users.user_hash = ?", userHash).
		Joins("left join (select * from user_preferences) as pref on users.user_hash = pref.user_hash_id").
		Scan(&model); err.Error != nil {
		return model, err.Error
	}

	return model, nil
}

func NewUsersRepository() *UserRepository {
	return &UserRepository{
		&base.Repository{TableName: "users"},
	}
}
