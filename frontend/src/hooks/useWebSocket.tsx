import { useEffect, useRef } from "react";
import { emit, WSAction, type WSMessage } from "../types/ws";

export function useWebSocket() {
  const webSocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080/api/ws");

    webSocketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket Connected");

      emit(socket, WSAction.JoinGame, "lobby");
    };

    socket.onmessage = (event) => {
      try {
        const data: WSMessage = JSON.parse(event.data);
        console.log("📩 Broadcast Received:", data);
      } catch (err) {
        console.error("Failed to parse socket message:", err);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    socket.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    return () => {
      socket.close();
    };
  }, []);

  return webSocketRef;
}
