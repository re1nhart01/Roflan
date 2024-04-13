package socket

type SocketCaller struct {
}

type Caller struct {
	Emitter interface {
		EmitByEvent(client *SocketClient, message *SocketMessage) error
	}
	Hub interface {
		AddClient(client *SocketClient, topicId string)
		RemoveClient(clientUserHash string, topicId string) error
		GetClient(topicId string, userHash string) *SocketClient
	}
	Client *SocketClient
}

func (sock *SocketCaller) Call(caller *Caller) {
	for {
		mT, message, err := caller.Client.Connector.ReadMessage()

		if err != nil {
			caller.Hub.RemoveClient(caller.Client.UserHash, caller.Client.TopicId)
			return
		}

		msg := SocketMessage{
			MessageType: mT,
			Message:     message,
		}

		if err := caller.Emitter.EmitByEvent(caller.Client, &msg); err != nil {
			caller.Hub.RemoveClient(caller.Client.UserHash, caller.Client.TopicId)
			return
		}
	}
}

func NewSocketCaller() *SocketCaller {
	return &SocketCaller{}
}
