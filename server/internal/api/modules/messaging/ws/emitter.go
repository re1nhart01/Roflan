package ws

import (
	"fmt"
	"github.com/roflan.io/helpers"
	"github.com/roflan.io/socket"
)

type SocketEmitter struct {
}

func (emitter *SocketEmitter) EmitByEvent(client *socket.SocketClient, message *socket.SocketMessage) error {

	fmt.Println(helpers.ParseByteToMap(message.Message))
	//event := socketMessage.ParseSocketMessage()
	//parsedSocketMessage := models.SocketEvent{
	//	Event: event["event"].(string),
	//	Data:  event["data"],
	//}
	//handler := SocketHandler{
	//	SocketMessage: &socketMessage,
	//	Client:        client,
	//	Db:            db,
	//	SocketEvent:   &parsedSocketMessage,
	//}
	//switch event["event"].(string) {
	//case "SendMessage":
	//	SendMessageHandler(handler)
	//	break
	//case "Connect":
	//	fmt.Println("Connected!")
	//case "ReadAllMessages":
	//	fmt.Println("read all messages sf[olewokfoke")
	//	ReadAllMessagesHandler(handler)
	//	break
	//case "RemoveOneMessage":
	//	DeleteMessageHandler(handler)
	//	break
	//case "RemoveBunchMessages":
	//	DeleteMessageBunchHandler(handler)
	//	break
	//default:
	//	fmt.Println("default")
	//}
	fmt.Println()
	return nil
}

func NewEmitter() *SocketEmitter {
	return &SocketEmitter{}
}
