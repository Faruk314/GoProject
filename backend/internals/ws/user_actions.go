package ws

import "github.com/gorilla/websocket"

func (cm *ConnectionManager) Add(userId int, conn *websocket.Conn) {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	client := &Client{
		conn: conn,
		send: make(chan interface{}, 256),
	}

	cm.clients[userId] = client

	go client.writePump()
}

func (cm *ConnectionManager) Remove(userId int) {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	if client, ok := cm.clients[userId]; ok {
		close(client.send)
		delete(cm.clients, userId)
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

func (cm *ConnectionManager) Get(userId int) (*Client, bool) {
	cm.mu.RLock()
	defer cm.mu.RUnlock()

	client, ok := cm.clients[userId]

	return client, ok
}
