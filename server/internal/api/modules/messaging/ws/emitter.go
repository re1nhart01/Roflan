package ws

import (
	"fmt"
	"github.com/roflan.io/api/modules/messaging/repository"
	"github.com/roflan.io/helpers"
	"github.com/roflan.io/socket"
)

type SocketEmitter struct {
}

const (
	SendMessage         = "sendMessage"
	Connect             = "connect"
	CloseConn           = "close"
	Online              = "online"
	ReadAllMessage      = "readAllMessages"
	RemoveOneMessage    = "removeOneMessage"
	RemoveBunchMessages = "removeBunchMessages"
)

func (emitter *SocketEmitter) EmitByEvent(client *socket.SocketClient, message *socket.SocketMessage) error {
	messageMap := helpers.ParseByteToMap(message.Message)
	eventName := helpers.S(messageMap["type"])
	eventData := helpers.F[map[string]any](messageMap["data"])
	eventHandler := NewMessagingEmitterHandler(&client.Hub, repository.NewMessageRepository())
	fmt.Println(messageMap, eventName, eventData)
	switch eventName {
	case Connect:
		return eventHandler.ConnectEvent(client)
	case CloseConn:
		return eventHandler.DisconnectEvent(client)
	case SendMessage:
		return eventHandler.SendMessageEvent(client, eventData)
	case Online:
		return eventHandler.IsOnlineEvent(client)
	case ReadAllMessage:
		return eventHandler.ReadAllMessagesEvent(client)
	case RemoveOneMessage:
		break
	case RemoveBunchMessages:
		break
	default:
	}
	return nil
}

func NewEmitter() *SocketEmitter {
	return &SocketEmitter{}
}
