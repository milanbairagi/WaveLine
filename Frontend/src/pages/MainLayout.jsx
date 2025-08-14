import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import ChatList from "../components/ChatList";
import ChatMessages from "../components/ChatMessages";
import { useUser } from "../context/userContext";
import Logout from "../components/buttons/Logout";
import NewChatButton from "../components/buttons/NewChatButton";
import SearchListDropDown from "../components/SearchListDropDown";
import ThemeToggleButton from "../components/buttons/ThemeToggleButton";
import ClickAwayListener from "../components/common/ClickAwayListener";
import api from "../api";
import { IoChatbubbleEllipsesOutline, IoPersonOutline } from "react-icons/io5";

const MainLayout = () => {
  const { chatId } = useParams();
  const { user } = useUser();

  const navigate = useNavigate();

  // Chats Lists
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);

  // Chats dropdown when clicking on New Chat button
  const [searchDropDownOn, setSearchDropDownOn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedUser, setSearchedUser] = useState([]);

  // Get user IDs from all chats
  const userIdsInChats = chats.flatMap((chat) =>
		chat.participants_detail.map((participant) => participant.id)
  );

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await api.get("/chats/");
        const data = response.data;
        setChats(data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoadingChats(false);
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setSearchedUser([]);
      return;
    }

    const fetchUsers = async () => {
      // Fetch users based on search term
      const response = await api.get(`/accounts/?search=${searchTerm}`);
      const data = response.data.filter(user => !userIdsInChats.includes(user.id));
      setSearchedUser(data);
    };

    fetchUsers();
  }, [searchTerm]);

  const updateSearchTerm = (term) => {
    setSearchTerm(term);
  };

  // handle user selection in searched users card
  const handleSelectUser = async (user_id) => {
    /* Create a new chat with the selected user */
    const data = {participants: user_id};
    try {
      const response = await api.post('chats/', data);
      setChats(prev => [...prev, response.data]);

      setSearchDropDownOn(false);
      navigate(`/chat/${response.data.id}`);

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.warn("Chat may already exist or invalid request:", error.response.data);
      } else {
        console.error("Error creating chat:", error.message || error);
      }
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-neutral-bg-100 to-neutral-bg-300 dark:from-dark-bg-50 dark:to-dark-bg-100 flex flex-col">
      {/* Header */}
      <div className="bg-neutral-bg-50 dark:bg-dark-bg-100 border-b border-neutral-bg-400 dark:border-dark-bg-300 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Brand & Welcome */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
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
            <div className="relative flex items-center space-x-3">
              {searchDropDownOn && (
                <ClickAwayListener onClickAway={() => setSearchDropDownOn(false)}>
                  <div className="absolute right-4 top-16">
                    <SearchListDropDown users={searchedUser} updateSearchTerm={updateSearchTerm} handleClick={handleSelectUser} />
                  </div>
                </ClickAwayListener>
              )}
              <NewChatButton handleClick={() => setSearchDropDownOn(!searchDropDownOn)} />
              <Logout />
              <ThemeToggleButton />
            </div>
          </div>
          
          {/* Mobile Welcome */}
          {/* View only on ChatList Page */}
          {(user && !chatId) && (
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
          <aside className={`w-full sm:w-80 ${chatId ? 'hidden sm:block' : 'block'} border-r border-neutral-bg-300 dark:border-dark-bg-300 bg-neutral-bg-50 dark:bg-dark-bg-100 overflow-y-auto`}>
            <ChatList chats={chats} loading={loadingChats} />
          </aside>
          
          {/* Chat Area */}
        <main className={`${chatId ? "flex" : "hidden"} sm:flex flex-1 flex-col bg-neutral-bg-200 dark:bg-dark-bg-200`}>
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
