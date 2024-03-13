package pg

import (
	"fmt"
	"github.com/roflan.io/environment"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type IConnector interface {
	ConnectToDatabase() error
	GetInstance() *PostgresInstance
}

var pgInstance *PostgresInstance = nil

type PostgresInstance struct {
	Instance *gorm.DB
	cfg      struct {
		host     string
		pass     string
		username string
		dbname   string
		port     string
	}
}

func ConnectToDatabase(isCreatedDatabase bool) error {
	apt := PostgresInstance{
		cfg: struct {
			host     string
			pass     string
			username string
			dbname   string
			port     string
		}{
			host:     environment.GEnv().GetVariable("POSTGRES_HOST"),
			pass:     environment.GEnv().GetVariable("POSTGRES_PASSWORD"),
			username: environment.GEnv().GetVariable("POSTGRES_USER"),
			port:     environment.GEnv().GetVariable("POSTGRES_PORT"),
		},
	}
	c := apt.cfg

	c.dbname = map[bool]string{
		true:  environment.GEnv().GetVariable("DB_NAME"),
		false: environment.GEnv().GetVariable("DB_NAME_DEFAULT"),
	}[isCreatedDatabase]

	dsn := fmt.Sprintf("host=%s user=%s password=%s port=%s dbname=%s", c.host, c.username, c.pass, c.port, c.dbname)
	fmt.Println(dsn)
	apt.Instance, _ = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if apt.Instance.Error != nil {
		fmt.Println("something went wrong with db")
		return apt.Instance.Error
	}
	pgInstance = &apt
	return nil
}

func GetDatabaseInstance() *PostgresInstance {
	if pgInstance == nil {
		if err := ConnectToDatabase(false); err != nil {
			panic(err)
		}
	}
	return pgInstance
}

func GDB() *PostgresInstance {
	if pgInstance == nil {
		if err := ConnectToDatabase(true); err != nil {
			panic(err)
		}
	}
	return pgInstance
}

func (db *PostgresInstance) Eliminate() {
	if pgInstance == nil {
		return
	}
	sqlDb, err := pgInstance.Instance.DB()
	if err != nil {
		panic("err on Eliminate method")
	}
	_ = sqlDb.Close()
	pgInstance = nil
}

// CreateSpecificDatabase TODO: Find better solution :)
func CreateSpecificDatabase(name string) {
	curr := GetDatabaseInstance()
	curr.Instance.Exec(fmt.Sprintf("CREATE DATABASE %s;", name))
	curr.Eliminate()
	defer func() {
		err := ConnectToDatabase(true)
		if err != nil {
			panic("CreateSpecificDatabase error")
		}
	}()
}
