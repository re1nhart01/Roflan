package pseudo

import (
	"context"
	"strconv"
	"time"
)

// Important: It's pseudo redis, to handle codes

type Pseudo struct {
	CodeHandler           map[string]int
	CodeHandlerCancelFunc map[string]context.CancelFunc
}

var Entity = &Pseudo{
	CodeHandler:           map[string]int{},
	CodeHandlerCancelFunc: map[string]context.CancelFunc{},
}

func AddCode(phone string, code string, withExpiration bool) {
	toInt, _ := strconv.Atoi(code)
	Entity.CodeHandler[phone] = toInt

	if withExpiration {
		var outerCtx, cancel = context.WithCancel(context.Background())
		Entity.CodeHandlerCancelFunc[phone] = cancel
		go func(ctx context.Context, phone string) {
			select {
			case <-time.After(40 * time.Second):
				delete(Entity.CodeHandler, phone)
				delete(Entity.CodeHandlerCancelFunc, phone)
			case <-ctx.Done():
				delete(Entity.CodeHandler, phone)

			}
		}(outerCtx, phone)
	}
}

func RemoveCode(phone string) {
	if Entity.CodeHandlerCancelFunc[phone] != nil {
		Entity.CodeHandlerCancelFunc[phone]()
	}
	delete(Entity.CodeHandler, phone)
}

func GetCode(phone string) string {
	return strconv.Itoa(Entity.CodeHandler[phone])
}

func IsCodeExists(phone string) bool {
	return Entity.CodeHandler[phone] != 0
}
