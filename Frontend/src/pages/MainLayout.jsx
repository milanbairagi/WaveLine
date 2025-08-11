import { useState } from "react";
import { useParams } from "react-router-dom";

import ChatList from "../components/ChatList";
import ChatMessages from "../components/ChatMessages";

const MainLayout = () => {
  const { chatId } = useParams();

  return (
    <div className="flex">
      <aside className="w-1/4">
        <ChatList />
      </aside>
      <main className="flex-1">
        {!chatId ? (
          <div>Select a chat to view messages</div>
        ) : (
          <ChatMessages chatId={chatId} />
        )}
      </main>
    </div>
  )
};

export default MainLayout;
