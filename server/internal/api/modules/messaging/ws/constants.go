package ws

type SocketMessage struct {
	MessageType int
	Message     []byte
}

const (
	ConnectSocket = ":topic_id/:user_token"
)

const MESSAGING_ROUTER = "messaging_router"
