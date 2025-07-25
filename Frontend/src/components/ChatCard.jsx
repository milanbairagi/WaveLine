const ChatCard = ({ chat }) => {
	return (
	<div className="chat-card">
		<h3>
			{chat.participants_detail[0].username} and {" "}
			{chat.participants_detail[1].username}
		</h3>
	</div>
);
}

export default ChatCard;