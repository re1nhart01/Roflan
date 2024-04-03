package pg

import (
	"github.com/roflan.io/models"
	"sync"
	"time"
)

type IModels interface {
	NewRolesTable() string
	NewUsersTable() string
}

func InitializeTables(wg *sync.WaitGroup, models IModels) {
	defer wg.Done()
	instance := GDB()

	instance.CallManualSQL(models.NewRolesTable())
	instance.CallManualSQL("insert into public.roles (key, value_representation) values ('test', 'test');")
	instance.CallManualSQL(models.NewUsersTable())
}

func InitializeFunctions(wg *sync.WaitGroup) {
	defer wg.Done()
	instance := GDB()
	time.Sleep(5 * time.Second)
	instance.CallManualSQL(TimestampUpdateTrigger(UpdatedAtLabel))
	instance.CallManualSQL(CreateTimestampTriggerOnTable(models.UsersTable, UpdatedAtLabel))
}
