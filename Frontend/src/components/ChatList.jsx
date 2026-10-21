import ChatCard from "./ChatCard";
import { IoChatbubbleEllipsesOutline, IoAddOutline } from "react-icons/io5";
import Logo from "../assets/Logo.svg?react";


const ChatList = ({chats, loading}) => {

  if (loading) {
    return (
      <div className="p-4 h-full justify-center flex items-center">
        <div className="text-center">
          <div className="mb-3 w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto animate-spin"></div>
          <p className="text-text-secondary text-sm dark:text-dark-text-secondary">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col h-full flex">
      {/* Chat List Header */}
      <div className="px-4 py-4 bg-gradient-to-r border-b border-neutral-bg-300 from-primary-50 to-primary-100 dark:from-dark-bg-200 dark:to-dark-bg-300 dark:border-dark-bg-300">
        <div className="justify-between flex items-center">
          <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
            Conversations
          </h2>
          <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium dark:bg-dark-bg-100 dark:text-primary-400">
            {chats.length}
          </span>
        </div>
      </div>

      {/* Chat List Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {chats.length > 0 ? (
          <div className="space-y-0">
            {chats.map(chat => (
              <ChatCard key={chat.id} chat={chat} />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="mb-4 w-16 h-16 bg-gradient-to-br rounded-full justify-center mx-auto from-primary-100 to-primary-200 dark:from-dark-bg-200 dark:to-dark-bg-300 flex items-center">
              <Logo className="mt-1 w-10 mr-1.5" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-text-primary dark:text-dark-text-primary">No conversations yet</h3>
            <p className="mb-4 px-4 text-text-secondary text-sm dark:text-dark-text-secondary">
              Start your first conversation to see it here.
            </p>
            <button className="px-4 py-2 bg-gradient-to-r text-white rounded-xl font-medium mx-auto text-sm from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] flex items-center space-x-2">
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