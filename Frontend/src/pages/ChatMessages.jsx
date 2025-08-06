import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api"; // Assuming you have an API utility to fetch data

const ChatMessages = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const fetchMessages = async () => {
    try {
      const response = await api.get(`/chats/${chatId}/messages`);
      const data = await response.data;
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  return (
    <div className="chat-messages">
      {loading ? (
        <div>Loading messages...</div>
      ) : (
        <ul>
          {messages.map((message) => (
            <li key={message.id}>
              {message.content} - {message.sender}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ChatMessages;