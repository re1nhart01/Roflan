package api

import (
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
		Where("? = ?", field, value).
		Find(&existedModel).
		RowsAffected > 0
}

func (user *UserRepository) GetUserByPhone(phone string) {
}

func NewUsersRepository() *UserRepository {
	return &UserRepository{
		&base.Repository{TableName: "users"},
	}
}
