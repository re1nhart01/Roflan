package ws

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/roflan.io/api/base"
	"github.com/roflan.io/api/modules/messaging/repository"
	"github.com/roflan.io/helpers"
	"github.com/roflan.io/jwt"
	"github.com/roflan.io/models"
	"github.com/roflan.io/paginator"
	socket2 "github.com/roflan.io/socket"
	"net/http"
	"strings"
	"time"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type IMessagingRepo interface {
	AddMessage(userHash, topicHash, body string, mediaIds []string) (*models.MessageModelFull, error)
	BulkReadMessages(queries map[string][]string) (paginator.ObjectPaginator, error)
	BulkSetMessageStatus(topicHashId string, status int) error
	GetLastMessage(topicHashId string) (*models.MessageModelFull, error)
}

type ITopicsRepo interface {
	CheckIsTopicUserExists(hash, userHash string) bool
	CheckIsTopicExists(hash string) bool
}

type MessagingWSHandler struct {
	*base.Handler
	IMessagingRepo
	ITopicsRepo
}

type MessagingEmitterHandler struct {
	Hub *socket2.Hub
	IMessagingRepo
}

var messagingEmitterHandler = MessagingEmitterHandler{
	Hub:            nil,
	IMessagingRepo: nil,
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
		closeHandler(1460, "no topicId or UserToken")
		return
	}

	claims, err := jwt.VerifyToken(strings.TrimSpace(userToken))
	if err != nil {
		closeHandler(1461, "verification error")
		return
	}

	if !messaging.CheckIsTopicExists(topicId) {
		closeHandler(1462, "verification error")
		return
	}

	if !messaging.CheckIsTopicUserExists(topicId, claims.UserHash) {
		closeHandler(1463, "verification error")
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

	fmt.Println(hub.GetRoom(topicId))

	hub.AddClient(client, topicId)
	caller := socket2.NewSocketCaller()

	caller.Call(&socket2.Caller{
		Emitter: emitter,
		Hub:     hub,
		Client:  client,
	})
}

func (wsms *MessagingEmitterHandler) ConnectEvent(client *socket2.SocketClient) error {
	clients := wsms.Hub.GetRoom(client.TopicId)
	message := &socket2.SocketMessage{
		MessageType: 1,
		Message: helpers.WrapToBytes(helpers.GiveSocketMessage(Connect, map[string]any{
			"user": client.UserHash,
		})),
	}
	if err := wsms.Hub.BroadcastTo(message, clients, client.UserHash, true); err != nil {
		return err
	}
	return nil
}

func (wsms *MessagingEmitterHandler) DisconnectEvent(client *socket2.SocketClient) error {
	clients := wsms.Hub.GetRoom(client.TopicId)
	message := &socket2.SocketMessage{
		MessageType: 1,
		Message: helpers.WrapToBytes(helpers.GiveSocketMessage(CloseConn, map[string]any{
			"user": client.UserHash,
		})),
	}
	if err := wsms.Hub.BroadcastTo(message, clients, client.UserHash, false); err != nil {
		return err
	}
	return nil
}

func (wsms *MessagingEmitterHandler) SendMessageEvent(client *socket2.SocketClient, message map[string]any) error {
	clients := wsms.Hub.GetRoom(client.TopicId)

	body := helpers.S(message["body"])
	messageList, ok := message["mediaIds"].([]any)
	list := []any{}
	if ok {
		list = messageList
	}
	mediaIds := helpers.AnyToStringSlice(list)

	fmt.Println(client.UserHash, client.TopicId, body, mediaIds)

	newMessage, err := wsms.AddMessage(client.UserHash, client.TopicId, body, mediaIds)
	if err != nil {
		return err
	}

	sockMessage := &socket2.SocketMessage{
		MessageType: 1,
		Message: helpers.WrapToBytes(helpers.GiveSocketMessage(SendMessage, map[string]any{
			"message": newMessage,
			"sender":  client.UserHash,
		})),
	}

	if err := wsms.Hub.BroadcastTo(sockMessage, clients, client.UserHash, true); err != nil {
		return err
	}

	return nil
}

func (wsms *MessagingEmitterHandler) IsOnlineEvent(client *socket2.SocketClient) error {
	clients := wsms.Hub.GetRoom(client.TopicId)
	message := &socket2.SocketMessage{
		MessageType: 1,
		Message: helpers.WrapToBytes(helpers.GiveSocketMessage(Online, map[string]any{
			"user": client.UserHash,
			"now":  time.Now().UnixNano(),
		})),
	}
	if err := wsms.Hub.BroadcastTo(message, clients, client.UserHash, false); err != nil {
		return err
	}
	return nil
}

func (wsms *MessagingEmitterHandler) ReadAllMessagesEvent(client *socket2.SocketClient) error {
	clients := wsms.Hub.GetRoom(client.TopicId)
	if err := wsms.BulkSetMessageStatus(client.TopicId, repository.ReadMessageStatus); err != nil {
		return err
	}

	lastMessage, err := wsms.GetLastMessage(client.TopicId)
	if err != nil {
		return err
	}

	message := &socket2.SocketMessage{
		MessageType: 1,
		Message: helpers.WrapToBytes(helpers.GiveSocketMessage(ReadAllMessage, map[string]any{
			"lastMessage": *lastMessage,
			"now":         time.Now().UnixNano(),
			"sender":      client.UserHash,
		})),
	}

	if err := wsms.Hub.BroadcastTo(message, clients, client.UserHash, true); err != nil {
		return err
	}

	return nil
}

func NewMessagingEmitterHandler(hub *socket2.Hub, repo IMessagingRepo) *MessagingEmitterHandler {
	return &MessagingEmitterHandler{
		hub,
		repo,
	}
}

func NewMessagingHandler(basePath string, repo IMessagingRepo, topicRepo ITopicsRepo) *MessagingWSHandler {
	return &MessagingWSHandler{
		&base.Handler{
			Name: MESSAGING_ROUTER,
			Path: fmt.Sprintf("/%s/messaging", basePath),
		},
		repo,
		topicRepo,
	}
}
