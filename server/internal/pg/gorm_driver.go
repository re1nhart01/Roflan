package pg

import (
	"github.com/roflan.io/models"
	"sync"
	"time"
)

type IModels interface {
	NewRolesTable() string
	NewUsersTable() string
	NewTelegramIdsTable() string
	NewUserPreferencesTable() string
	NewFileTable() string
	NewPostsTable() string
	NewPostsFilesTable() string
	NewLinkUserModel() string
	NewTopicsModel() string
	NewTopicUsersTable() string
	NewMessagesTable() string
	NewMessagesMediaTable() string
}

func InitializeTables(wg *sync.WaitGroup, models IModels) {
	defer wg.Done()
	instance := GDB()

	instance.CallManualSQL(models.NewRolesTable())
	instance.CallManualSQL("insert into public.roles (key, value_representation) values ('graduate', 'graduate'), ('student', 'student');")
	instance.CallManualSQL(models.NewUsersTable())
	instance.CallManualSQL(models.NewTelegramIdsTable())
	instance.CallManualSQL(models.NewUserPreferencesTable())
	instance.CallManualSQL(models.NewFileTable())
	instance.CallManualSQL(models.NewPostsTable())
	instance.CallManualSQL(models.NewPostsFilesTable())
	instance.CallManualSQL(models.NewLinkUserModel())
	instance.CallManualSQL(models.NewTopicsModel())
	instance.CallManualSQL(models.NewTopicUsersTable())
	instance.CallManualSQL(models.NewMessagesTable())
	instance.CallManualSQL(models.NewMessagesMediaTable())
}

func InitializeFunctions(wg *sync.WaitGroup) {
	defer wg.Done()
	instance := GDB()
	time.Sleep(5 * time.Second)
	instance.CallManualSQL(TimestampUpdateTrigger(UpdatedAtLabel))
	instance.CallManualSQL(CreateTimestampTriggerOnTable(models.UsersTable, UpdatedAtLabel))
}
