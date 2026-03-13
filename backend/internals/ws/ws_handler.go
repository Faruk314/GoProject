package ws

import (
	"backend/internals/models"
	"backend/internals/response"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

const (
	writeWait  = 10 * time.Second
	pongWait   = 60 * time.Second
	pingPeriod = (pongWait * 9) / 10
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

func (cm *ConnectionManager) HandleWS(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("user_id").(int)
	if !ok {
		response.SendError(w, http.StatusUnauthorized, "User context missing")
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Upgrade error: %v", err)
		return
	}

	cm.Add(userID, conn)

	defer func() {
		cm.Remove(userID)
		conn.Close()
		log.Printf("User %d cleaned up and disconnected", userID)
	}()

	log.Printf("User %d is now live via WebSocket", userID)

	cm.handleUserConnection(conn, userID)
}

func (cm *ConnectionManager) handleUserConnection(conn *websocket.Conn, userID int) {
	conn.SetReadDeadline(time.Now().Add(pongWait))
	conn.SetPongHandler(func(string) error {
		conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	stopPing := make(chan struct{})
	go func() {
		ticker := time.NewTicker(pingPeriod)
		defer ticker.Stop()
		for {
			select {
			case <-ticker.C:
				if err := conn.WriteControl(websocket.PingMessage, []byte{}, time.Now().Add(writeWait)); err != nil {
					return
				}
			case <-stopPing:
				return
			}
		}
	}()

	for {
		var msg models.WSMessage

		err := conn.ReadJSON(&msg)
		if err != nil {
			log.Printf("Read error for user %d: %v", userID, err)
			close(stopPing)
			break
		}

		switch msg.Action {
		case models.ActionJoinRoom:
			cm.JoinRoom(userID, msg.Room)
		case models.ActionLeaveRoom:
			cm.LeaveRoom(userID, msg.Room)
		default:
			log.Printf("Unknown action: %s from user %d", msg.Action, userID)
		}
	}
}
