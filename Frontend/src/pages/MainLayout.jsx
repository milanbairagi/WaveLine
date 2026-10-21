import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants";
import ChatList from "../components/ChatList";
import ChatMessages from "../components/ChatMessages";
import { useUser } from "../context/userContext";
import { useWebSocket } from "../hooks/useWebSocket";
import Logout from "../components/buttons/Logout";
import NewChatButton from "../components/buttons/NewChatButton";
import SearchListDropDown from "../components/SearchListDropDown";
import ThemeToggleButton from "../components/buttons/ThemeToggleButton";
import ClickAwayListener from "../components/common/ClickAwayListener";
import api from "../api";
import { IoPersonOutline } from "react-icons/io5";
import logoWithName from "../assets/logowithname.png";
import Logo from "../assets/Logo.svg?react";

const MainLayout = () => {
  const { chatId } = useParams();
  const { user } = useUser();

  const navigate = useNavigate();

  const socketURL = import.meta.env.VITE_SOCKET_URL || "ws://localhost:8000";

  const {
    connect,
    disconnect,
    sendMessage,
    isConnected,
    messages,
    setMessages,
    seenMessageIds,
    setSeenMessageIds,
    sendSeenMessageFlag,
  } = useWebSocket(`${socketURL}/chats/message/`);
  
  // Chats Lists
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);

  // Chats dropdown when clicking on New Chat button
  const [searchDropDownOn, setSearchDropDownOn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedUser, setSearchedUser] = useState([]);

  const [wsCurrentChatMessages, setWsCurrentChatMessages] = useState([]);

  // Get user IDs from all chats
  const userIdsInChats = useMemo(
    () =>
      chats.flatMap((chat) =>
        chat.participants_detail.map((participant) => participant.id),
      ),
    [chats],
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
      const data = response.data.filter(
        (user) => !userIdsInChats.includes(user.id),
      );
      setSearchedUser(data);
    };

    fetchUsers();
  }, [searchTerm, userIdsInChats]);

  useEffect(() => {
    if (user?.id) {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (token) {
        connect(token);
      }
    }
  
    return () => {
      disconnect()
    };
  }, [user?.id, connect, disconnect]);
  
  // Handle incoming messages from WebSocket
  useEffect(() => {
    if (messages.length > 0) {
      messages.forEach((message) => {
        if (chatId && message.chat === parseInt(chatId)) {
          setWsCurrentChatMessages((prev) => [...prev, message]);
        }

        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === message.chat
              ? {
                  ...chat,
                  last_message: message,
                }
              : chat,
          ),
        );
      });

      setMessages([]); // Clear messages after processing
    }
  }, [messages, chatId, setMessages, setChats]);

  // Change last_message to seen in chat list when user is in the chat and receives a new message
  useEffect(() => {
    if (chatId || wsCurrentChatMessages.length > 0) {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === parseInt(chatId)
            ? {
                ...chat,
                last_message: {
                  ...chat.last_message,
                  status: "seen",
                }
              }
            : chat
        )
      );
    }
  }, [wsCurrentChatMessages, chatId]);

  const updateSearchTerm = (term) => {
    setSearchTerm(term);
  };

  const clearWsCurrentChatMessages = () => {
    setWsCurrentChatMessages([]);
  };

  // handle user selection in searched users card
  const handleSelectUser = async (user_id) => {
    /* Create a new chat with the selected user */
    const data = { participants: user_id };
    try {
      const response = await api.post("chats/", data);
      setChats((prev) => [...prev, response.data]);

      setSearchDropDownOn(false);
      navigate(`/chat/${response.data.id}`);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.warn(
          "Chat may already exist or invalid request:",
          error.response.data,
        );
      } else {
        console.error("Error creating chat:", error.message || error);
      }
    }
  };

  
  return (
    <div className="flex-col h-dvh bg-gradient-to-br from-neutral-bg-100 to-neutral-bg-300 dark:from-dark-bg-50 dark:to-dark-bg-100 flex">
      {/* <div> */}
      {/*   {isConnected ? "Connected to WebSocket" : "Disconnected from WebSocket"} */}
      {/* </div> */}
      {/* Header */}
      <div
        className={`${chatId ? "hidden sm:block" : "block"}  bg-neutral-bg-50 dark:bg-dark-bg-100 border-b border-neutral-bg-400 dark:border-dark-bg-300 shadow-sm`}
      >
        <div className="px-4 py-4">
          <div className="justify-between flex items-center">
            {/* Brand & Welcome */}
            <div className="flex items-center space-x-4">
              <img src={logoWithName} alt="WaveLine" className="w-32 h-auto" />
              {user && (
                <div className="text-text-secondary hidden sm:flex items-center space-x-2 dark:text-dark-text-secondary">
                  <IoPersonOutline className="w-5 h-5" />
                  <span className="text-lg">Welcome, {user.username}!</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="relative flex items-center space-x-3">
              {searchDropDownOn && (
                <ClickAwayListener
                  onClickAway={() => setSearchDropDownOn(false)}
                >
                  <div className="top-16 absolute right-4">
                    <SearchListDropDown
                      users={searchedUser}
                      updateSearchTerm={updateSearchTerm}
                      handleClick={handleSelectUser}
                    />
                  </div>
                </ClickAwayListener>
              )}
              <NewChatButton
                handleClick={() => setSearchDropDownOn(!searchDropDownOn)}
              />
              <Logout />
              <ThemeToggleButton />
            </div>
          </div>

          {/* Mobile Welcome */}
          {/* View only on ChatList Page */}
          {user && !chatId && (
            <div className="mt-4 text-text-secondary sm:hidden flex items-center space-x-2 dark:text-dark-text-secondary">
              <IoPersonOutline className="w-5 h-5" />
              <span>Welcome, {user.username}!</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Sidebar */}
        <aside
          className={`w-full sm:w-80 ${chatId ? "hidden sm:block" : "block"} border-r border-neutral-bg-300 dark:border-dark-bg-300 bg-neutral-bg-50 dark:bg-dark-bg-100 overflow-y-auto`}
        >
          <ChatList chats={chats} loading={loadingChats} />
        </aside>

        {/* Chat Area */}
        <main
          className={`${chatId ? "flex" : "hidden"} sm:flex flex-1 flex-col bg-neutral-bg-200 dark:bg-dark-bg-200`}
        >
          {!chatId ? (
            <div className="flex-1 justify-center flex items-center">
              <div className="text-center">
                <div className="mb-6 w-20 h-20 bg-gradient-to-br rounded-full justify-center mx-auto from-primary-100 to-primary-200 dark:from-dark-bg-200 dark:to-dark-bg-300 flex items-center">
                  <Logo className="mt-1 w-14 mr-2" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-text-primary dark:text-dark-text-primary">
                  Select a chat to start messaging
                </h3>
                <p className="text-text-secondary dark:text-dark-text-secondary">
                  Choose a conversation from the sidebar to view messages
                </p>
              </div>
            </div>
          ) : (
            <ChatMessages chatId={chatId} sendMessage={sendMessage} isConnected={isConnected} wsMessages={wsCurrentChatMessages} clearWsMessage={clearWsCurrentChatMessages} seenMessageIds={seenMessageIds} setSeenMessageIds={setSeenMessageIds} sendSeenMessageFlag={sendSeenMessageFlag} />
          )}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
