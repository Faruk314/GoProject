package ws

import (
	"sync"

	"github.com/gorilla/websocket"
)

type ConnectionManager struct {
	connections map[int]*websocket.Conn
	rooms       map[string]map[int]struct{}
	userRooms   map[int]map[string]struct{}
	mu          sync.RWMutex
}

func NewConnectionManager() *ConnectionManager {
	return &ConnectionManager{
		connections: make(map[int]*websocket.Conn),
		rooms:       make(map[string]map[int]struct{}),
		userRooms:   make(map[int]map[string]struct{}),
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

	if rooms, ok := cm.userRooms[userId]; ok {
		for roomName := range rooms {
			if usersInRoom, exists := cm.rooms[roomName]; exists {
				delete(usersInRoom, userId)

				if len(usersInRoom) == 0 {
					delete(cm.rooms, roomName)
				}
			}
		}

		delete(cm.userRooms, userId)
	}
}

func (cm *ConnectionManager) Get(userId int) (*websocket.Conn, bool) {
	cm.mu.RLock()
	defer cm.mu.RUnlock()

	conn, ok := cm.connections[userId]

	return conn, ok
}

func (cm *ConnectionManager) JoinRoom(userId int, roomName string) {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	if _, online := cm.connections[userId]; !online {
		return
	}

	if _, alreadyJoined := cm.userRooms[userId][roomName]; alreadyJoined {
		return
	}

	if cm.rooms[roomName] == nil {
		cm.rooms[roomName] = make(map[int]struct{})
	}

	cm.rooms[roomName][userId] = struct{}{}

	if cm.userRooms[userId] == nil {
		cm.userRooms[userId] = make(map[string]struct{})
	}

	cm.userRooms[userId][roomName] = struct{}{}
}

func (cm *ConnectionManager) LeaveRoom(userId int, roomName string) {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	if users, exists := cm.rooms[roomName]; exists {

		delete(users, userId)

		if len(users) == 0 {
			delete(cm.rooms, roomName)
		}

	}

	if rooms, exists := cm.userRooms[userId]; exists {
		delete(rooms, roomName)

		if len(rooms) == 0 {
			delete(cm.userRooms, userId)
		}
	}
}
