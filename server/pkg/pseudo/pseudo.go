package pseudo

import (
	"context"
	"fmt"
	"strconv"
	"time"
)

// Important: It's pseudo redis, to handle codes

type Pseudo struct {
	CodeHandler map[string]int
}

var PSEUDO_ENTITY = &Pseudo{CodeHandler: map[string]int{}}

var ctx, cancel = context.WithCancel(context.Background())

func AddCode(phone string, code string, withExpiration bool) {
	toInt, _ := strconv.Atoi(code)
	PSEUDO_ENTITY.CodeHandler[phone] = toInt
	fmt.Println(toInt)
	if withExpiration {
		go func() {
			time.Sleep(40 * time.Second)
			delete(PSEUDO_ENTITY.CodeHandler, phone)
		}()
	}
}

func RemoveCode(phone string) {
	delete(PSEUDO_ENTITY.CodeHandler, phone)
}

func GetCode(phone string) string {
	return strconv.Itoa(PSEUDO_ENTITY.CodeHandler[phone])
}

func IsCodeExists(phone string) bool {
	return PSEUDO_ENTITY.CodeHandler[phone] != 0
}
