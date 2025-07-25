import { useState, useEffect } from "react";

import api from "./api";
import ChatCard from "./components/ChatCard";

const ChatList = () => {
  const [chats, setChats] = useState([]);

  const fetchChatList = async () => {
    try {
      const response = await api.get("/chats/");
      setChats(response.data);
    } catch (error) {
      console.error("Error fetching chat list:", error);
    }
  };

  useEffect(() => {
    fetchChatList();
  }, []);

  return (
    <div className="chat-list">
      <h2>Chat List</h2>
        {chats.length > 0 ? (
            chats.map(chat => (
                <ChatCard key={chat.id} chat={chat} />
            ))
        ) : (
            <p>No chats available</p>
        )}
    </div>
  );
}

export default ChatList;