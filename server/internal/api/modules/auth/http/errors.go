package api

const (
	BodyNotExists          = "Body Not Exists or it's empty"
	UserNotFound           = "user not found"
	InvalidPassword        = "User phone or password is invalid"
	AlreadyLogged          = "user's already logged in"
	CodeExpire             = "Code is already expired"
	InvalidCode            = "Code is invalid"
	UnhandledError         = "unhandled error"
	TokenIsNotRefresh      = "token is not refresh"
	RefreshExpires         = "refresh token is expired"
	CreatePreferencesError = "error while creating user preferences"
)
