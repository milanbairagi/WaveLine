import { useState, useEffect } from "react";

const ChatList = () => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchData = async () => {
      const response = await fetch("http://127.0.0.1:8000/api/chats/", {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json"
				}
			});
      const data = await response.json();
      setChats(data);
    };

    fetchData();
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