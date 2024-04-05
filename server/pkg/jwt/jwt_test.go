package jwt

import (
	"testing"
	"time"
)

func TestCreateToken(t *testing.T) {
	argsUserHash := "my_user_hash"
	argsId := 0

	expirationTime := time.Now().Add(50 * time.Minute)

	got1, err := CreateToken(argsUserHash, argsId, "access", &expirationTime)
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

	got1, err1 := CreateToken(argsUserHash, argsId, "refresh", &expirationTime)
	got2, err2 := CreateToken(argsUserHash, argsId, "access", &zeroTime)

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

	got1, err := CreateToken(argsUserHash, argsId, "refresh", &expirationTime)
	print(got1)
	if err != nil {
		t.Error(err)
	}

	claims, err := VerifyToken(got1)

	if err != nil {
		t.Error(err)
	}

	if claims.UserHash != argsUserHash {
		t.Error("invalid userHash")
	}

	if claims.Id != argsId {
		t.Error("invalid identify")
	}

	if claims.ExpiresAt.Unix() != expirationTime.Unix() {
		t.Error("invalid identify")
	}

	println(argsUserHash, claims)

}
