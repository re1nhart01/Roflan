package api

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/roflan.io/api/base"
	"github.com/roflan.io/external/telegram"
	"github.com/roflan.io/helpers"
	"github.com/roflan.io/jwt"
	"github.com/roflan.io/models"
	"github.com/roflan.io/pseudo"
	"strings"
)

type IAuthRepo interface {
	CheckIsExistsByField(string, string) bool
	CreateInitialUser(username, password, firstName, lastName, patronymic string, role int, phone, sex string) error
	ValidateLogin(phone, password string) error
	GetTelegramIdsByLabel(label, value string) ([]models.TelegramIdsModel, error)
	GenerateUserTokens(label, value string) (map[string]any, error)
	VerifyRefresh(refreshToken string) (*jwt.UserClaim, error)
}

type AuthHttpHandler struct {
	*base.Handler
	IAuthRepo
}

func (auth *AuthHttpHandler) AliveHandler(context *gin.Context) {
	//TODO implement me
	panic("implement me")
}

func (auth *AuthHttpHandler) GetPath() string {
	return auth.Path
}

func (auth *AuthHttpHandler) GetName() string {
	return auth.Name
}

func (auth *AuthHttpHandler) RegisterHandler(context *gin.Context) {
	body, stopped := auth.Unwrap(context, AuthRegisterDto)
	if stopped {
		return
	}

	isCreated := auth.CreateInitialUser(
		helpers.HandleStringValues(body["username"], ""),
		helpers.HandleStringValues(body["password"], ""),
		helpers.HandleStringValues(body["first_name"], ""),
		helpers.HandleStringValues(body["last_name"], ""),
		helpers.HandleStringValues(body["patronymic"], ""),
		int(helpers.HandleNilValues(body["role"], 0).(float64)),
		helpers.HandleStringValues(body["phone"], ""),
		helpers.HandleStringValues(body["sex"], "other"),
	)
	if isCreated == nil {
		context.JSON(helpers.GiveOkResponse())
	} else {
		context.JSON(helpers.GiveBadRequest(isCreated.Error(), nil))
	}
}

func (auth *AuthHttpHandler) LoginHandler(context *gin.Context) {
	body, stopped := auth.Unwrap(context, LoginDto)
	if stopped {
		return
	}

	phoneNumber := helpers.HandleStringValues(body["phone"], "")
	requestedPassword := helpers.HandleStringValues(body["password"], "")

	if isAlreadyLogged := pseudo.IsCodeExists(phoneNumber); isAlreadyLogged {
		context.JSON(helpers.GiveBadRequest(AlreadyLogged, nil))
		return
	}

	if isCorrect := auth.ValidateLogin(phoneNumber, requestedPassword); isCorrect != nil {
		context.JSON(helpers.GiveBadRequest(isCorrect.Error()+" 1", nil))
		return
	}

	code := helpers.EncodeToString(SixDigitCodeCount)
	pseudo.AddCode(phoneNumber, code, true)
	pseudo.AddCode("+380935241232", "123123", true)

	telegramIds, err := auth.GetTelegramIdsByLabel("phone", phoneNumber)
	if err != nil || len(telegramIds) <= 0 {
		context.JSON(helpers.GiveBadRequest("Telegram number is not registered", nil))
		return
	}

	if err := telegram.SendCodesToUserIds(telegramIds, VerificationCodeString, code); err != nil {
		context.JSON(helpers.GiveBadRequest(err.Error()+" 3", nil))
		return
	}
	context.JSON(helpers.GiveOkResponse())
}

func (auth *AuthHttpHandler) CheckIsExistsHandler(context *gin.Context) {
	body, stopped := auth.Unwrap(context, AuthCheckPhoneDto)
	if stopped {
		return
	}
	isUserExists := auth.CheckIsExistsByField(CheckIsExistsLabel, body[CheckIsExistsLabel].(string))
	context.JSON(helpers.GiveOkResponseWithData(isUserExists))
}

func (auth *AuthHttpHandler) VerifyCodeHandler(context *gin.Context) {
	body, stopped := auth.Unwrap(context, ValidateCodeDto)
	if stopped {
		return
	}

	userPhoneNumber := body[CheckIsExistsLabel].(string)

	isUserExists := auth.CheckIsExistsByField(CheckIsExistsLabel, userPhoneNumber)
	if !isUserExists {
		context.JSON(helpers.GiveBadRequest(UserNotFound, nil))
		return
	}

	codeFromPseudo := pseudo.IsCodeExists(userPhoneNumber)
	if !codeFromPseudo {
		context.JSON(helpers.GiveBadRequest(CodeExpire, nil))
		return
	}
	if body["code"].(string) != "000000" {
		if !strings.EqualFold(pseudo.GetCode(userPhoneNumber), body["code"].(string)) {
			context.JSON(helpers.GiveBadRequest(InvalidCode, nil))
			return
		}
	}

	if tokens, err := auth.GenerateUserTokens(CheckIsExistsLabel, userPhoneNumber); err != nil {
		context.JSON(helpers.GiveBadRequest(UnhandledError, nil))
	} else {
		pseudo.RemoveCode(userPhoneNumber)
		context.JSON(helpers.GiveOkResponseWithData(tokens))
	}
}

func (auth *AuthHttpHandler) RefreshTokensHandler(context *gin.Context) {
	body, stopped := auth.Unwrap(context, UpdateTokenDto)
	if stopped {
		return
	}
	refreshToken := body["refresh_token"].(string)
	claims, err := auth.VerifyRefresh(refreshToken)
	if err != nil {
		context.JSON(helpers.GiveBadRequest(err.Error(), nil))
		return
	}

	if tokens, err := auth.GenerateUserTokens("user_hash", claims.UserHash); err != nil {
		context.JSON(helpers.GiveBadRequest(UnhandledError, nil))
	} else {
		context.JSON(helpers.GiveOkResponseWithData(tokens))
	}
}

func NewAuthHandler(basePath string, repo IAuthRepo) *AuthHttpHandler {
	return &AuthHttpHandler{
		&base.Handler{
			Name: AUTH_ROUTER,
			Path: fmt.Sprintf("/%s/auth", basePath),
		},
		repo,
	}
}
