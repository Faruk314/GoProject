package handlers

import (
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

	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func handleUserConnection(conn *websocket.Conn, userID int) {
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

	defer func() {
		close(stopPing)
		log.Printf("User %d disconnected", userID)
		conn.Close()
	}()

	for {

		messageType, p, err := conn.ReadMessage()
		if err != nil {
			log.Printf("Read error for user %d: %v", userID, err)
			break
		}

		log.Printf("Message from %d: %s", userID, string(p))

		if err := conn.WriteMessage(messageType, p); err != nil {
			log.Printf("Write error for user %d: %v", userID, err)
			break
		}
	}
}

func HandleWS(w http.ResponseWriter, r *http.Request) {
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

	log.Printf("User %s is now live via WebSocket", userID)

	go handleUserConnection(conn, userID)
}
