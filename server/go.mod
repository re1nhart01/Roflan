module roflan.io/api

go 1.21.6

replace github.com/roflan.io/jwt => ./pkg/jwt

replace github.com/roflan.io/environment => ./internal/env

replace github.com/roflan.io/pg => ./internal/pg

replace github.com/roflan.io/api => ./internal/api

replace github.com/roflan.io/api/base => ./internal/api/base

replace github.com/roflan.io/api/modules => ./internal/api/modules

require (
	github.com/roflan.io/environment v0.0.0-00010101000000-000000000000
	github.com/roflan.io/pg v0.0.0-00010101000000-000000000000
)

require (
	github.com/jackc/pgpassfile v1.0.0 // indirect
	github.com/jackc/pgservicefile v0.0.0-20231201235250-de7065d80cb9 // indirect
	github.com/jackc/pgx/v5 v5.5.5 // indirect
	github.com/jackc/puddle/v2 v2.2.1 // indirect
	github.com/jinzhu/inflection v1.0.0 // indirect
	github.com/jinzhu/now v1.1.5 // indirect
	github.com/stretchr/testify v1.8.4 // indirect
	golang.org/x/crypto v0.21.0 // indirect
	golang.org/x/sync v0.6.0 // indirect
	golang.org/x/text v0.14.0 // indirect
	gorm.io/driver/postgres v1.5.7 // indirect
	gorm.io/gorm v1.25.7 // indirect
)
