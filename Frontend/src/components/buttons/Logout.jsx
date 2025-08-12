import { useUser } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";

const Logout = () => {
	const { logoutUser } = useUser();
	const navigate = useNavigate();

	const handleLogout = () => {
		logoutUser();
		navigate("/login");
	};

	return (
    <button 
      onClick={handleLogout}
      className="flex items-center space-x-2 bg-neutral-bg-200 dark:bg-dark-bg-200 hover:bg-neutral-bg-300 dark:hover:bg-dark-bg-300 border border-neutral-bg-300 dark:border-dark-bg-300 hover:border-primary-300 dark:hover:border-primary-500 text-text-primary dark:text-dark-text-primary hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-xl font-medium transition-all duration-200 hover:shadow-md"
      title="Logout"
    >
      <IoLogOutOutline className="w-5 h-5" />
      <span className="hidden sm:inline">Logout</span>
    </button>
  );
};

export default Logout;
