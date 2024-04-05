package api

const (
	RegisterRoute            = "sign-in"
	InitialVerificationRoute = "initial-verification"
	VerifyCode               = "verify"
	LoginRoute               = "log-in"
	CheckIsExistRoute        = "check"
	RefreshToken             = "refresh"
)

const AUTH_ROUTER = "auth_router"

const CheckIsExistsLabel = "phone"

const SixDigitCodeCount = 6
const RefreshTokenExpirationTime = 2_592_000
const AccessTokenExpirationTime = 86_400

const VerificationCodeString = "%s: <#> Verification Code: %s. sSs"
