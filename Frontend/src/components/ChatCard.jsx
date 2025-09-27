import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import Avatar from "./Avatar";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";


const ChatCard = ({ chat }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate(`/chat/${chat.id}`);
  }

  const otherParticipant = chat.participants_detail[0].id === user.id
    ? chat.participants_detail[1]
    : chat.participants_detail[0];

  return (
    <div
      className="bg-neutral-bg-100 dark:bg-dark-bg-100 border border-neutral-bg-300 dark:border-dark-bg-300 rounded-xl p-4 mb-3 cursor-pointer transition-all duration-200 hover:bg-neutral-bg-200 dark:hover:bg-dark-bg-200 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-500 group"
      onClick={handleChatClick}
    >
      <div className="flex items-center space-x-4">
        {/* Avatar */}
        <Avatar name={otherParticipant?.username} style={"w-12 h-12"} />

        {/* Chat Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
              {otherParticipant.username}
            </h3>
            <IoChatbubbleEllipsesOutline className="w-5 h-5 text-text-tertiary dark:text-dark-text-tertiary group-hover:text-primary-500 transition-colors duration-200" />
          </div>
          <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-1">
            {/* Chat with {otherParticipant.username} */}
            {chat.last_message
              ? chat.last_message.content
              : "No messages yet. Say hi!"
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
