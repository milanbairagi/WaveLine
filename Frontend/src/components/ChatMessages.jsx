import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import { useUser } from "../context/userContext";
import { useWebSocket } from "../hooks/useWebSocket";
import { ACCESS_TOKEN } from "../constants";

const ChatMessages = ({ chatId }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  
  const {
    connect,
    disconnect,
    sendMessage,
    isConnected,
    messages,
    setMessages
  } = useWebSocket(`ws://localhost:8000/ws/chats/${chatId}/message/`);

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (token) {
        connect(token);
      }
    }

    return () => {
      disconnect();
    };
  }, [user, connect, disconnect]);

  useEffect(() => {
    if (messages.length > 0) {
      setChatMessages(prev => [...prev, ...messages]);
      setMessages([]); // Clear messages after processing
    }
  }, [messages, chatId]);

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (message.trim() && isConnected) {
      sendMessage(chatId, message.trim())
      setMessage("");
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/chats/${chatId}/messages`);
      const data = await response.data;
      setChatMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  if (!user) {
    return <div>Please log in to view chat messages.</div>;
  }

  return (
		<div className="chat-messages">
			{loading ? (
				<div>Loading messages...</div>
			) : (
				<div>
					<div className="chat-header">
						<h3>Chat {chatId}</h3>
						<div
							className={`connection-status ${
								isConnected ? "connected" : "disconnected"
							}`}
						>
							{isConnected ? "🟢 Connected" : "🔴 Disconnected"}
						</div>
					</div>
					<ul>
						{chatMessages.map((message) => (
							<li key={message.id}>
								{message.content} - {message.sender}
							</li>
						))}
					</ul>

					<form onSubmit={handleSendMessage}>
						<input
							type="text"
							placeholder="Type your message..."
							value={message}
							onChange={(e) => setMessage(e.target.value)}
						/>
						<button type="submit">Send</button>
					</form>
				</div>
			)}
		</div>
  );
}

export default ChatMessages;