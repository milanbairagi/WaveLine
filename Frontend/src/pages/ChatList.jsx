import { useState, useEffect } from "react";

import api from "../api";
import ChatCard from "../components/ChatCard";
import { useUser } from "../context/userContext";

const ChatList = () => {
  const { user } = useUser();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChatList = async () => {
    try {
      const response = await api.get("/chats/");
      setChats(response.data);
    } catch (error) {
      console.error("Error fetching chat list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatList();
  }, []);

  if (loading) {
    return <div>Loading chats...</div>;
  };

  return (
    <div className="chat-list">
      {user && <h2>Welcome, {user.username}!</h2>}
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