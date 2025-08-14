import { IoAddOutline } from "react-icons/io5";

const NewChatButton = ({handleClick}) => {
	return (
		<button onClick={handleClick} className="flex items-center sm:space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02]">
			<IoAddOutline className="w-5 h-5" />
			<span className="hidden sm:inline">New Chat</span>
		</button>
	);
};

export default NewChatButton;
