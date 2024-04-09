package ws

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/roflan.io/api/base"
	"github.com/roflan.io/jwt"
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
	defer socket.Close()

	if err != nil || topicId == "" || userToken == "" {
		socket.Close()
		return
	}

	claims, err := jwt.VerifyToken(strings.TrimSpace(userToken))
	hub := GetHub()
	emitter := NewEmitter()

	client := &SocketClient{
		Connector: socket,
		Hub:       *hub,
		UserHash:  claims.UserHash,
		TopicId:   topicId,
	}

	hub.AddClient(client, topicId)

	for {
		mT, message, err := client.Connector.ReadMessage()

		if err != nil {
			client.Hub.RemoveClient(client.UserHash, topicId)
			return
		}

		msg := SocketMessage{
			MessageType: mT,
			Message:     message,
		}

		if err := emitter.EmitByEvent(client, msg); err != nil {
			client.Hub.RemoveClient(client.UserHash, topicId)
			return
		}
	}
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
