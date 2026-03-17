// context/WebSocketContext.tsx
import React, { createContext, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { emit, WSAction } from "../types/ws";

interface WebSocketContextType {
  send: (action: typeof WSAction, payload: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const socketRef = useRef<WebSocket | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080/api/ws");
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket Connected");
      emit(socket, WSAction.JoinGame, "lobby");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.action === "join_game") {
        navigate("/game");
      }
    };

    return () => socket.close();
  }, [navigate]);

  const send = (action: WSAction, payload: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      emit(socketRef.current, action, payload);
    }
  };

  return (
    <WebSocketContext.Provider value={{ send }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWS = () => {
  const context = useContext(WebSocketContext);
  if (!context)
    throw new Error("useWS must be used within a WebSocketProvider");
  return context;
};
