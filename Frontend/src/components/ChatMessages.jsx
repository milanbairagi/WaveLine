import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../api";
import { useUser } from "../context/userContext";
import { useWebSocket } from "../hooks/useWebSocket";
import { ACCESS_TOKEN } from "../constants";
import ChatMessage from "./ChatMessage";
import Avatar from "./Avatar";
import { 
  IoSendOutline, 
  IoChatbubbleEllipsesOutline
} from "react-icons/io5";

const ChatMessages = ({ chatId }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatInfo, setChatInfo] = useState(null);
  const messagesEndRef = useRef(null);
  const { user } = useUser();

  const navigate = useNavigate();
  
  const {
    connect,
    disconnect,
    sendMessage,
    isConnected,
    messages,
    setMessages
  } = useWebSocket(`ws://localhost:8000/ws/chats/${chatId}/message/`);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

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
      if (error.response?.status === 400) {
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchChatInfo = async () => {
    try {
      const response = await api.get(`/chats/${chatId}/`);
      setChatInfo(response.data);
    } catch (error) {
      // TODO: Show error message to user
      if (error.response?.status === 400 || error.response?.status === 403 || error.response?.status === 404) {
        navigate("/");
      }
    }
  };

  useEffect(() => {
    fetchChatInfo();
    fetchMessages();
  }, [chatId]);

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-text-secondary dark:text-dark-text-secondary">Please log in to view chat messages.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-text-secondary dark:text-dark-text-secondary">Loading messages...</p>
        </div>
      </div>
    );
  }

  const otherParticipant = chatInfo?.participants_detail?.find(p => p.id !== user.id);

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-neutral-bg-50 dark:bg-dark-bg-100 border-b border-neutral-bg-300 dark:border-dark-bg-300 px-4 py-4">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <Avatar name={otherParticipant?.username} />
          
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary truncate">
              {otherParticipant?.username || `Chat ${chatId}`}
            </h1>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-secondary-500' : 'bg-text-tertiary dark:bg-dark-text-tertiary'}`}></div>
              <span className="text-sm text-text-secondary dark:text-dark-text-secondary">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-scroll p-4 space-y-4 bg-gradient-to-br from-neutral-bg-200 to-neutral-bg-300 dark:from-dark-bg-200 dark:to-dark-bg-300">
        {chatMessages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-dark-bg-100 dark:to-dark-bg-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <IoChatbubbleEllipsesOutline className="w-8 h-8 text-primary-500" />
            </div>
            <p className="text-text-secondary dark:text-dark-text-secondary">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          chatMessages.map((msg) => {
            const isOwn = msg.sender === user.id;
            return (
              <ChatMessage 
                key={msg.id} 
                message={msg} 
                isOwn={isOwn} 
                user={user} 
              />
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-neutral-bg-50 dark:bg-dark-bg-100 border-t border-neutral-bg-300 dark:border-dark-bg-300 p-4">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 pr-12 border border-neutral-bg-300 dark:border-dark-bg-300 rounded-2xl bg-neutral-bg-100 dark:bg-dark-bg-200 text-text-primary dark:text-dark-text-primary placeholder-text-tertiary dark:placeholder-dark-text-tertiary focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
              disabled={!isConnected}
            />
          </div>
          <button
            type="submit"
            disabled={!message.trim() || !isConnected}
            className={`p-3 rounded-2xl transition-all duration-200 ${
              message.trim() && isConnected
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                : 'bg-neutral-bg-300 dark:bg-dark-bg-300 text-text-tertiary dark:text-dark-text-tertiary cursor-not-allowed'
            }`}
          >
            <IoSendOutline className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatMessages;