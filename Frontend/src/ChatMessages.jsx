import { useParams } from "react-router-dom";

const ChatMessages = () => {
  const { chatId } = useParams();

  return (
    <div className="chat-messages">
      <h2>Chat Messages from Chat: {chatId}</h2>
    </div>
  );
}

export default ChatMessages;