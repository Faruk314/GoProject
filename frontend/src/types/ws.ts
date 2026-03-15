const WSAction = {
  JoinGame: "join_game",
} as const;

export type WSActionType = (typeof WSAction)[keyof typeof WSAction];

interface WSMessage<T = unknown> {
  action: WSActionType;
  room?: string;
  data?: T;
}

const emit = <T>(
  socket: WebSocket,
  action: WSActionType,
  room?: string,
  data?: T,
) => {
  const payload: WSMessage<T> = { action, room, data };
  socket.send(JSON.stringify(payload));
};

export { type WSMessage, WSAction, emit };
