package ws

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/roflan.io/api/base"
	"github.com/roflan.io/jwt"
	socket2 "github.com/roflan.io/socket"
	"net/http"
	"strings"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type IMessagingRepo interface {
}

type MessagingWSHandler struct {
	*base.Handler
	IMessagingRepo
}

func (messaging *MessagingWSHandler) GetPath() string {
	return messaging.Path
}

func (messaging *MessagingWSHandler) GetName() string {
	return messaging.Name
}

func (messaging *MessagingWSHandler) ConnectToSocketHandler(context *gin.Context) {
	userToken := context.Param("user_token")
	topicId := context.Param("topic_id")

	socket, err := upgrader.Upgrade(context.Writer, context.Request, nil)
	closeHandler := socket.CloseHandler()
	defer socket.Close()

	if err != nil || topicId == "" || userToken == "" {
		closeHandler(1487, "no topicId or UserToken")
		return
	}

	claims, err := jwt.VerifyToken(strings.TrimSpace(userToken))
	if err != nil {
		closeHandler(1488, "verification error")
		return
	}
	hub := socket2.GetHub()
	emitter := NewEmitter()

	client := &socket2.SocketClient{
		Connector: socket,
		Hub:       *hub,
		UserHash:  claims.UserHash,
		TopicId:   topicId,
	}

	hub.AddClient(client, topicId)
	caller := socket2.NewSocketCaller()

	caller.Call(&socket2.Caller{
		Emitter: emitter,
		Hub:     hub,
		Client:  client,
	})
}

func NewMessagingHandler(basePath string, repo IMessagingRepo) *MessagingWSHandler {
	return &MessagingWSHandler{
		&base.Handler{
			Name: MESSAGING_ROUTER,
			Path: fmt.Sprintf("/%s/messaging", basePath),
		},
		repo,
	}
}
