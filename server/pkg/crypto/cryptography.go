package crypto

import (
	"crypto/sha1"
	"encoding/base64"
	"fmt"
	"golang.org/x/crypto/bcrypt"
	"slices"
	"strings"
)

const HashingCycles int = 6

func GetSha1(serverHash string, salt string) string {
	pwd := sha1.New()
	pwd.Write([]byte(serverHash))
	pwd.Write([]byte(salt))
	return fmt.Sprintf("%x", pwd.Sum(nil))
}

func HashPassword(password string) string {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), HashingCycles)
	if err != nil {
		return ""
	}
	return string(bytes)
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func MakePasswordHash(serverHash string, salt string) string {
	pwd := sha1.New()
	pwd.Write([]byte(serverHash))
	pwd.Write([]byte(salt))
	return fmt.Sprintf("%x", pwd.Sum(nil))
}

func GenerateRecreatableString(fStr []string) string {
	slices.Sort(fStr)
	joined := strings.Join(fStr, "@")
	return base64.StdEncoding.EncodeToString([]byte(joined))
}
