package ws

func (cm *ConnectionManager) JoinRoom(userId int, roomName string) {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	if _, online := cm.clients[userId]; !online {
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
