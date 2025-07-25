import { useUser } from "../context/userContext";

const ChatCard = ({ chat }) => {
	const { user } = useUser();

	return (
		<div className="chat-card" style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
			<h3>
				{chat.participants_detail[0].id === user.id
					? chat.participants_detail[1].username
					: chat.participants_detail[0].username}
			</h3>
		</div>
	);
};

export default ChatCard;
