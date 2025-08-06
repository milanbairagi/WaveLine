import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";


const ChatCard = ({ chat }) => {
	const { user } = useUser();
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate(`/chat/${chat.id}`);
  }

	return (
		<div className="chat-card" style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }} onClick={handleChatClick}>
			<h3>
				{chat.participants_detail[0].id === user.id
					? chat.participants_detail[1].username
					: chat.participants_detail[0].username}
			</h3>
		</div>
	);
};

export default ChatCard;
