package pseudo

import (
	"fmt"
	"github.com/roflan.io/helpers"
	"strconv"
	"time"
)

// Important: It's pseudo redis, to handle codes

type Pseudo struct {
	CodeHandler map[string]int
}

var PSEUDO_ENTITY = &Pseudo{CodeHandler: map[string]int{}}

func AddCode(phone string, withExpiration bool) {
	code := helpers.EncodeToString(6)
	toInt, _ := strconv.Atoi(code)
	PSEUDO_ENTITY.CodeHandler[phone] = toInt
	fmt.Println(toInt)
	if withExpiration {
		go func() {
			time.Sleep(10 * time.Second)
			delete(PSEUDO_ENTITY.CodeHandler, phone)
		}()
	}
}

func RemoveCode(phone string) {
	delete(PSEUDO_ENTITY.CodeHandler, phone)
}
