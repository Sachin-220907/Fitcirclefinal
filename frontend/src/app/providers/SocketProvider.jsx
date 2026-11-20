import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const listenersRef = useRef({});
  const broadcastChannelRef = useRef(null);

  // Initialize BroadcastChannel for cross-tab instant real-time sync
  useEffect(() => {
    let bc = null;
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        bc = new BroadcastChannel("fitcircle_realtime_hub");
        broadcastChannelRef.current = bc;

        bc.onmessage = (event) => {
          const { eventName, data } = event.data || {};
          if (eventName && listenersRef.current[eventName]) {
            listenersRef.current[eventName].forEach((callback) => callback(data));
          }
        };
      }
    } catch (err) {
      console.warn("BroadcastChannel not supported in this environment:", err);
    }

    return () => {
      if (bc) {
        bc.close();
      }
    };
  }, []);

  // Initialize Socket.io client if available
  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";
    let connection = null;

    try {
      connection = io(socketUrl, {
        autoConnect: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
        withCredentials: true,
        transports: ["websocket", "polling"]
      });

      connection.on("connect", () => {
        setIsConnected(true);
      });

      connection.on("disconnect", () => {
        setIsConnected(false);
      });

      connection.onAny((eventName, data) => {
        if (listenersRef.current[eventName]) {
          listenersRef.current[eventName].forEach((callback) => callback(data));
        }
      });

      setSocket(connection);
    } catch (err) {
      console.warn("Socket.io initialization fallback to local channel:", err);
    }

    return () => {
      if (connection) {
        connection.disconnect();
      }
    };
  }, []);

  // Subscribe to real-time events
  const on = useCallback((eventName, callback) => {
    if (!listenersRef.current[eventName]) {
      listenersRef.current[eventName] = [];
    }
    listenersRef.current[eventName].push(callback);

    if (socket) {
      socket.on(eventName, callback);
    }

    return () => {
      listenersRef.current[eventName] = (listenersRef.current[eventName] || []).filter(
        (cb) => cb !== callback
      );
      if (socket) {
        socket.off(eventName, callback);
      }
    };
  }, [socket]);

  // Emit a real-time event to socket and cross-tab channel
  const emit = useCallback((eventName, data) => {
    // 1. Broadcast locally to other tabs
    if (broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current.postMessage({ eventName, data });
      } catch (e) {
        console.warn("Broadcast error:", e);
      }
    }

    // 2. Trigger local listeners in current tab
    if (listenersRef.current[eventName]) {
      listenersRef.current[eventName].forEach((callback) => callback(data));
    }

    // 3. Emit to backend socket server if connected
    if (socket && isConnected) {
      socket.emit(eventName, data);
    }
  }, [socket, isConnected]);

  const contextValue = {
    socket,
    isConnected,
    on,
    emit
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  return context || {
    socket: null,
    isConnected: false,
    on: () => () => {},
    emit: () => {}
  };
}

export default SocketProvider;
