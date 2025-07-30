import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const ChatMessages = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch(`/chats/${chatId}/messages`);
      const data = await response.json();
      setMessages(data);
    };

    fetchMessages();
  }, [chatId]);

  return (
    <div className="chat-messages">
      <h2>Chat Messages from Chat: {chatId}</h2>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>{message.content}</li>
        ))}
      </ul>
    </div>
  );
}

export default ChatMessages;