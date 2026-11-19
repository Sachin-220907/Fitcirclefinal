import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";
    let connection = null;
    try {
      connection = io(socketUrl, {
        autoConnect: false,
        withCredentials: true
      });
      setSocket(connection);
    } catch {
      // socket init error fallback
    }

    return () => {
      if (connection) {
        connection.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}

export default SocketProvider;
