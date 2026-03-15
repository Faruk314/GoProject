package ws

import (
	"backend/internals/models"
	"log"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

type Client struct {
	conn *websocket.Conn
	send chan interface{}
}

type ConnectionManager struct {
	clients   map[int]*Client
	rooms     map[string]map[int]struct{}
	userRooms map[int]map[string]struct{}
	mu        sync.RWMutex
}

func NewConnectionManager() *ConnectionManager {
	return &ConnectionManager{
		clients:   make(map[int]*Client),
		rooms:     make(map[string]map[int]struct{}),
		userRooms: make(map[int]map[string]struct{}),
	}
}

func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			if err := c.conn.WriteJSON(message); err != nil {
				return
			}

		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

func (cm *ConnectionManager) EmitToRoom(roomName string, msg models.WSMessage) {
	cm.mu.RLock()
	defer cm.mu.RUnlock()

	userIds, exists := cm.rooms[roomName]
	if !exists {
		return
	}

	for userId := range userIds {
		if client, ok := cm.clients[userId]; ok {
			select {
			case client.send <- msg:
			default:
				log.Printf("Dropped message for user %d: buffer full", userId)
			}
		}
	}
}

func (cm *ConnectionManager) EmitToUser(userId int, msg models.WSMessage) {
	cm.mu.RLock()
	defer cm.mu.RUnlock()

	if client, ok := cm.clients[userId]; ok {
		select {
		case client.send <- msg:
		default:
			log.Printf("Dropped private message for user %d: buffer full", userId)
		}
	}
}
