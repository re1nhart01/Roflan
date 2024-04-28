module roflan.io/api

go 1.21.6

replace github.com/roflan.io/jwt => ./pkg/jwt

replace github.com/roflan.io/environment => ./internal/env

replace github.com/roflan.io/pg => ./internal/pg

replace github.com/roflan.io/api => ./internal/api

replace github.com/roflan.io/api/base => ./internal/api/base

replace github.com/roflan.io/api/modules => ./internal/api/modules

replace github.com/roflan.io/helpers => ./pkg/helpers

replace github.com/roflan.io/models => ./internal/models

replace github.com/roflan.io/external => ./internal/external

replace github.com/roflan.io/dto => ./pkg/dto

replace github.com/roflan.io/crypto => ./pkg/crypto

replace github.com/roflan.io/pseudo => ./pkg/pseudo

replace github.com/roflan.io/socket => ./pkg/socket

replace github.com/roflan.io/paginator => ./pkg/paginator

replace github.com/roflan.io/fs => ./pkg/fs

require (
	github.com/roflan.io/api v0.0.0-00010101000000-000000000000
	github.com/roflan.io/environment v0.0.0-00010101000000-000000000000
	github.com/roflan.io/pg v0.0.0-00010101000000-000000000000
)

require (
	cloud.google.com/go v0.112.2 // indirect
	cloud.google.com/go/compute v1.25.1 // indirect
	cloud.google.com/go/compute/metadata v0.2.3 // indirect
	cloud.google.com/go/firestore v1.15.0 // indirect
	cloud.google.com/go/iam v1.1.7 // indirect
	cloud.google.com/go/longrunning v0.5.6 // indirect
	cloud.google.com/go/storage v1.40.0 // indirect
	firebase.google.com/go v3.13.0+incompatible // indirect
	github.com/bytedance/sonic v1.11.3 // indirect
	github.com/chenzhuoyu/base64x v0.0.0-20230717121745-296ad89f973d // indirect
	github.com/chenzhuoyu/iasm v0.9.1 // indirect
	github.com/felixge/httpsnoop v1.0.4 // indirect
	github.com/gabriel-vasile/mimetype v1.4.3 // indirect
	github.com/gin-contrib/sse v0.1.0 // indirect
	github.com/gin-gonic/gin v1.9.1 // indirect
	github.com/go-logr/logr v1.4.1 // indirect
	github.com/go-logr/stdr v1.2.2 // indirect
	github.com/go-playground/locales v0.14.1 // indirect
	github.com/go-playground/universal-translator v0.18.1 // indirect
	github.com/go-playground/validator/v10 v10.19.0 // indirect
	github.com/go-telegram-bot-api/telegram-bot-api/v5 v5.5.1 // indirect
	github.com/goccy/go-json v0.10.2 // indirect
	github.com/golang-jwt/jwt/v5 v5.2.1 // indirect
	github.com/golang/groupcache v0.0.0-20210331224755-41bb18bfe9da // indirect
	github.com/golang/protobuf v1.5.4 // indirect
	github.com/google/s2a-go v0.1.7 // indirect
	github.com/google/uuid v1.6.0 // indirect
	github.com/googleapis/enterprise-certificate-proxy v0.3.2 // indirect
	github.com/googleapis/gax-go/v2 v2.12.3 // indirect
	github.com/gorilla/websocket v1.5.1 // indirect
	github.com/jackc/pgpassfile v1.0.0 // indirect
	github.com/jackc/pgservicefile v0.0.0-20231201235250-de7065d80cb9 // indirect
	github.com/jackc/pgx/v5 v5.5.5 // indirect
	github.com/jackc/puddle/v2 v2.2.1 // indirect
	github.com/jinzhu/inflection v1.0.0 // indirect
	github.com/jinzhu/now v1.1.5 // indirect
	github.com/json-iterator/go v1.1.12 // indirect
	github.com/klauspost/cpuid/v2 v2.2.7 // indirect
	github.com/kr/text v0.2.0 // indirect
	github.com/leodido/go-urn v1.4.0 // indirect
	github.com/mattn/go-isatty v0.0.20 // indirect
	github.com/modern-go/concurrent v0.0.0-20180306012644-bacd9c7ef1dd // indirect
	github.com/modern-go/reflect2 v1.0.2 // indirect
	github.com/pelletier/go-toml/v2 v2.1.1 // indirect
	github.com/roflan.io/api/base v0.0.0-00010101000000-000000000000 // indirect
	github.com/roflan.io/api/modules v0.0.0-00010101000000-000000000000 // indirect
	github.com/roflan.io/crypto v0.0.0-00010101000000-000000000000 // indirect
	github.com/roflan.io/dto v0.0.0-00010101000000-000000000000 // indirect
	github.com/roflan.io/external v0.0.0-00010101000000-000000000000 // indirect
	github.com/roflan.io/helpers v0.0.0-00010101000000-000000000000 // indirect
	github.com/roflan.io/jwt v0.0.0-00010101000000-000000000000 // indirect
	github.com/roflan.io/models v0.0.0-00010101000000-000000000000 // indirect
	github.com/roflan.io/pseudo v0.0.0-00010101000000-000000000000 // indirect
	github.com/roflan.io/socket v0.0.0-00010101000000-000000000000 // indirect
	github.com/rogpeppe/go-internal v1.12.0 // indirect
	github.com/twitchyliquid64/golang-asm v0.15.1 // indirect
	github.com/ugorji/go/codec v1.2.12 // indirect
	go.opencensus.io v0.24.0 // indirect
	go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc v0.50.0 // indirect
	go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp v0.50.0 // indirect
	go.opentelemetry.io/otel v1.25.0 // indirect
	go.opentelemetry.io/otel/metric v1.25.0 // indirect
	go.opentelemetry.io/otel/trace v1.25.0 // indirect
	golang.org/x/arch v0.7.0 // indirect
	golang.org/x/crypto v0.22.0 // indirect
	golang.org/x/net v0.24.0 // indirect
	golang.org/x/oauth2 v0.19.0 // indirect
	golang.org/x/sync v0.7.0 // indirect
	golang.org/x/sys v0.19.0 // indirect
	golang.org/x/text v0.14.0 // indirect
	golang.org/x/time v0.5.0 // indirect
	google.golang.org/api v0.172.0 // indirect
	google.golang.org/appengine v1.6.8 // indirect
	google.golang.org/genproto v0.0.0-20240412170617-26222e5d3d56 // indirect
	google.golang.org/genproto/googleapis/api v0.0.0-20240412170617-26222e5d3d56 // indirect
	google.golang.org/genproto/googleapis/rpc v0.0.0-20240412170617-26222e5d3d56 // indirect
	google.golang.org/grpc v1.63.2 // indirect
	google.golang.org/protobuf v1.33.0 // indirect
	gopkg.in/yaml.v3 v3.0.1 // indirect
	gorm.io/driver/postgres v1.5.7 // indirect
	gorm.io/gorm v1.25.7 // indirect
)
