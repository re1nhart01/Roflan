package ws

import "github.com/gorilla/websocket"

type SocketClient struct {
	Connector *websocket.Conn
	Hub       Hub
	UserHash  string
	TopicId   string
}

type Hub map[string]map[string]*SocketClient

var hubInstance = Hub{}

func GetHub() *Hub {
	if hubInstance == nil {
		NewHub()
	}

	return &hubInstance
}

func NewHub() {
	hubInstance = Hub{}
}

func (hub Hub) AddClient(client *SocketClient, topicId string) {

	if hub[topicId] == nil {
		hub[topicId] = map[string]*SocketClient{}
	}

	hub[topicId][client.UserHash] = client
}

func (hub Hub) RemoveClient(clientUserHash string, topicId string) error {
	room := hub[topicId]

	current := room[clientUserHash].Connector

	if err := current.Close(); err != nil {
		return err
	}

	delete(room, clientUserHash)

	if len(room) == 0 {
		delete(hub, topicId)
	}

	return nil
}

func (hub Hub) GetClient(topicId string, userHash string) *SocketClient {
	if hub[topicId] == nil {
		return nil
	}

	return hub[topicId][userHash]
}

func (ownClient *SocketClient) WriteMessage(messageType int, data []byte) error {
	sendError := ownClient.Connector.WriteMessage(messageType, data)
	return sendError
}
