import { useState, useEffect } from "react";

import api from "../api";
import ChatCard from "./ChatCard";
import { useUser } from "../context/userContext";
import { IoChatbubbleEllipsesOutline, IoAddOutline } from "react-icons/io5";


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
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-text-secondary dark:text-dark-text-secondary text-sm">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat List Header */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-dark-bg-200 dark:to-dark-bg-300 px-4 py-4 border-b border-neutral-bg-300 dark:border-dark-bg-300">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary flex items-center">
            <IoChatbubbleEllipsesOutline className="w-5 h-5 text-primary-500 mr-2" />
            Conversations
          </h2>
          <span className="bg-primary-100 dark:bg-dark-bg-100 text-primary-700 dark:text-primary-400 px-2 py-1 rounded-full text-xs font-medium">
            {chats.length}
          </span>
        </div>
      </div>

      {/* Chat List Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {chats.length > 0 ? (
          <div className="space-y-0">
            {chats.map(chat => (
              <ChatCard key={chat.id} chat={chat} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-dark-bg-200 dark:to-dark-bg-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <IoChatbubbleEllipsesOutline className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-2">No conversations yet</h3>
            <p className="text-text-secondary dark:text-dark-text-secondary text-sm mb-4 px-4">
              Start your first conversation to see it here.
            </p>
            <button className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] flex items-center space-x-2 mx-auto text-sm">
              <IoAddOutline className="w-4 h-4" />
              <span>Start Chat</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatList;