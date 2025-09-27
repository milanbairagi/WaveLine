import { useState, useEffect, useRef, useCallback } from "react";

export const useWebSocket = (url) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [seenMessageIds, setSeenMessageIds] = useState([]);
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
      socketRef.current = ws;

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
      } else if (data.type === "message_seen") {
        const { message_ids } = data;
        setSeenMessageIds(prev => [...prev, ...message_ids]);
      } else if (data.type === "error") {
        disconnect();
      } else if (data.type === "authenticated") {
        // console.log("User authenticated successfully");
        
      }
    };

    ws.onclose = () => {
      // console.log("WebSocket connection closed");
      setIsConnected(false);
      socketRef.current = null;
    };

    ws.onerror = (error) => {
      // console.error("WebSocket error:", error);
      setIsConnected(false);
      socketRef.current = null;
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
  }, []);

  const sendSeenMessageFlag = useCallback((chatId, messageIds) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: "messages_seen",
        chat_id: chatId,
        message_ids: messageIds
      }));
    }
  }, []);

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
    setMessages,
    seenMessageIds,
    setSeenMessageIds,
    sendSeenMessageFlag,
  };
};