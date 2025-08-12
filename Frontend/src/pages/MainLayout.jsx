import { useParams } from "react-router-dom";

import ChatList from "../components/ChatList";
import ChatMessages from "../components/ChatMessages";
import { useUser } from "../context/userContext";
import Logout from "../components/buttons/Logout";
import ThemeToggleButton from "../components/buttons/ThemeToggleButton";
import { IoChatbubbleEllipsesOutline, IoPersonOutline, IoAddOutline } from "react-icons/io5";

const MainLayout = () => {
  const { chatId } = useParams();
  const { user } = useUser();

  return (
    <div className="h-screen bg-gradient-to-br from-neutral-bg-100 to-neutral-bg-300 dark:from-dark-bg-50 dark:to-dark-bg-100 flex flex-col">
      {/* Header */}
      <div className="bg-neutral-bg-50 dark:bg-dark-bg-100 border-b border-neutral-bg-400 dark:border-dark-bg-300 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Brand & Welcome */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <IoChatbubbleEllipsesOutline className="w-8 h-8 text-primary-500 mr-3" />
                <h1 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">WaveLine</h1>
              </div>
              {user && (
                <div className="hidden sm:flex items-center space-x-2 text-text-secondary dark:text-dark-text-secondary">
                  <IoPersonOutline className="w-5 h-5" />
                  <span className="text-lg">Welcome, {user.username}!</span>
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02]">
                <IoAddOutline className="w-5 h-5" />
                <span className="hidden sm:inline">New Chat</span>
              </button>
              <Logout />
              <ThemeToggleButton />
            </div>
          </div>
          
          {/* Mobile Welcome */}
          {user && (
            <div className="sm:hidden mt-4 flex items-center space-x-2 text-text-secondary dark:text-dark-text-secondary">
              <IoPersonOutline className="w-5 h-5" />
              <span>Welcome, {user.username}!</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 border-r border-neutral-bg-300 dark:border-dark-bg-300 bg-neutral-bg-50 dark:bg-dark-bg-100 overflow-y-auto">
          <ChatList />
        </aside>
        
        {/* Chat Area */}
        <main className="flex-1 flex flex-col bg-neutral-bg-200 dark:bg-dark-bg-200">
          {!chatId ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-dark-bg-200 dark:to-dark-bg-300 rounded-full flex items-center justify-center mx-auto mb-6">
                  <IoChatbubbleEllipsesOutline className="w-10 h-10 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary dark:text-dark-text-primary mb-2">Select a chat to start messaging</h3>
                <p className="text-text-secondary dark:text-dark-text-secondary">Choose a conversation from the sidebar to view messages</p>
              </div>
            </div>
          ) : (
            <ChatMessages chatId={chatId} />
          )}
        </main>
      </div>
    </div>
  )
};

export default MainLayout;
