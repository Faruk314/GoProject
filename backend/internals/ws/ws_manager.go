package ws

import (
	"sync"

	"github.com/gorilla/websocket"
)

type ConnectionManager struct {
	connections map[int]*websocket.Conn
	mu          sync.RWMutex
}

func NewConnectionManager() *ConnectionManager {
	return &ConnectionManager{
		connections: make(map[int]*websocket.Conn),
	}
}

func (cm *ConnectionManager) Add(userId int, conn *websocket.Conn) {
	cm.mu.Lock()
	defer cm.mu.Unlock()
	cm.connections[userId] = conn
}

func (cm *ConnectionManager) Remove(userId int) {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	if conn, ok := cm.connections[userId]; ok {
		conn.Close()
		delete(cm.connections, userId)

	}
}

func (cm *ConnectionManager) Get(userId int) (*websocket.Conn, bool) {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	conn, ok := cm.connections[userId]

	return conn, ok
}
