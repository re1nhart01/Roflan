package jwt

import (
	"strconv"
	"testing"
	"time"
)

func TestCreateToken(t *testing.T) {
	argsUserHash := "my_user_hash"
	argsId := 0

	expirationTime := time.Now().Add(50 * time.Minute)

	got1, err := CreateToken(argsUserHash, argsId, &expirationTime)
	println(got1)
	if err != nil {
		t.Error(err)
	}

	if isValid := ValidateToken(got1); !isValid {
		t.Error("Token invalid")
	}
}

func TestCheckIsTokenExpired(t *testing.T) {
	argsUserHash := "my_user_hash"
	argsId := 0

	expirationTime := time.Now().Add(5 * time.Minute)
	zeroTime := time.Now()

	got1, err1 := CreateToken(argsUserHash, argsId, &expirationTime)
	got2, err2 := CreateToken(argsUserHash, argsId, &zeroTime)

	println(got1)
	println(got2)

	if err1 != nil || err2 != nil {
		t.Error(err1)
		t.Error(err2)
	}

	if isInvalid := CheckIsTokenExpired(got1); isInvalid {
		t.Error("Token without timer should be invalid")
	}

	if isValid := CheckIsTokenExpired(got2); !isValid {
		t.Error("Token with timer should be valid")
	}

}

func TestVerifyToken(t *testing.T) {
	argsUserHash := "my_user_hash"
	argsId := 0

	expirationTime := time.Now().Add(50 * time.Minute)

	got1, err := CreateToken(argsUserHash, argsId, &expirationTime)
	print(got1)
	if err != nil {
		t.Error(err)
	}

	userHash, identify, expirationTimer, err := VerifyToken(got1)

	if err != nil {
		t.Error(err)
	}

	if userHash != argsUserHash {
		t.Error("invalid userHash")
	}

	if identify != strconv.Itoa(argsId) {
		t.Error("invalid identify")
	}

	if expirationTimer != expirationTime.Unix() {
		t.Error("invalid identify")
	}

	println(argsUserHash, userHash, argsId, identify, expirationTimer)

}
