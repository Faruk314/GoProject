class SocketService {
  private static instance: SocketService;
  private socket: WebSocket | null = null;
  private listeners: Record<string, ((payload: unknown) => void)[]> = {};

  private constructor() {}

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect(url: string) {
    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    this.socket = new WebSocket(url);

    this.socket.onopen = () => console.log("WS Connected");

    this.socket.onmessage = (event) => {
      try {
        const { action, payload } = JSON.parse(event.data);
        this.emit(action, payload);
      } catch (err) {
        console.error("Failed to parse WS message", err);
      }
    };

    this.socket.onclose = () => {
      this.socket = null;
      console.warn("WS Disconnected");
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.onclose = null;
      this.socket.close();
      this.socket = null;
      console.log("WS Manually Closed");
    }
  }

  send(action: string, payload: unknown) {
    if (this.socket?.readyState !== WebSocket.OPEN) {
      console.warn("WS not connected");
      return;
    }

    this.socket.send(JSON.stringify({ action, payload }));
  }

  on(action: string, handler: (payload: unknown) => void) {
    if (!this.listeners[action]) {
      this.listeners[action] = [];
    }

    const handlers = this.listeners[action];

    if (!handlers.includes(handler)) {
      handlers.push(handler);
    }

    return () => {
      this.off(action, handler);
    };
  }

  off(action: string, handler: (payload: unknown) => void) {
    const handlers = this.listeners[action];
    if (!handlers) return;

    const filtered = handlers.filter((h) => h !== handler);

    if (filtered.length === 0) {
      delete this.listeners[action];
    } else {
      this.listeners[action] = filtered;
    }
  }

  private emit(action: string, payload: unknown) {
    const handlers = this.listeners[action];
    if (!handlers) return;

    handlers.forEach((handler) => {
      try {
        handler(payload);
      } catch (err) {
        console.error(`Error in handler for ${action}`, err);
      }
    });
  }
}

export const socketService = SocketService.getInstance();
