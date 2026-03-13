package models

type Action string

const (
	ActionJoinRoom    Action = "join_room"
	ActionLeaveRoom   Action = "leave_room"
	ActionSendMessage Action = "send_message"
)

type WSMessage struct {
	Action Action `json:"action"`
	Room   string `json:"room"`
	Data   string `json:"data"`
}
