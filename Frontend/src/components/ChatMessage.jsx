import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { IoCheckmark } from "react-icons/io5";

const ChatMessage = ({ message, isOwn }) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
        isOwn 
          ? 'bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-br-sm' 
          : 'bg-neutral-bg-100 dark:bg-dark-bg-200 text-text-primary dark:text-dark-text-primary rounded-bl-sm border border-neutral-bg-300 dark:border-dark-bg-300'
      }`}>
        <p className="text-sm leading-relaxed">{message.content}</p>
        <div className={`flex items-center justify-end mt-2 space-x-1 ${
          isOwn ? 'text-primary-100' : 'text-text-tertiary dark:text-dark-text-tertiary'
        }`}>
          <span className="text-xs">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isOwn && message.status === "sent" && <IoCheckmark className="w-3 h-3" />}
          {isOwn && message.status === "delivered" && <IoCheckmarkDoneOutline className="w-3 h-3" />}
          {isOwn && message.status === "seen" && <IoCheckmarkDoneOutline className="w-3 h-3 text-primary-600" />}

        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
