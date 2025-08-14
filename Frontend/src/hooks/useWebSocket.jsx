import { useState, useEffect, useRef, useCallback } from "react";

export const useWebSocket = (url) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  const connect = useCallback ((token) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.close();
    }

    const ws = new WebSocket(url);
    socketRef.current = ws;

    ws.onopen = () => {
      // console.log("WebSocket connection established");
      setIsConnected(true);
      setSocket(ws);

      if (token) {
        ws.send(JSON.stringify({
          type: "auth",
          token: token
        }));
      };
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type == "chat_message") {
        setMessages(prev => [
          ...prev,
          data.message
        ])
      } else if (data.type === "error") {
        disconnect();
      } else if (data.type === "authenticated") {
        // console.log("User authenticated successfully");
        
      }
    };

    ws.onclose = () => {
      // console.log("WebSocket connection closed");
      setIsConnected(false);
      setSocket(null);
    };


    ws.onerror = (error) => {
      // console.error("WebSocket error:", error);
      setIsConnected(false);
      setSocket(null);
    };

    return ws;
  }, [url]);

  const sendMessage = useCallback((chatId, content) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: "chat_message",
        chat_id: chatId,
        content: content
      }));
    };
  }, [])

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connect,
    disconnect,
    sendMessage,
    isConnected,
    messages,
    setMessages
  };
};