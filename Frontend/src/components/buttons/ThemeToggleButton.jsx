import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";
import useToggleTheme from "../../hooks/useToggleTheme";

const ThemeToggleButton = () => {
  const { isDarkMode, toggleTheme } = useToggleTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-full bg-neutral-bg-50 dark:bg-dark-bg-200 shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-bg-300 dark:border-dark-bg-300 z-10"
    >
      {isDarkMode ? (
        <IoSunnyOutline className="w-5 h-5 text-yellow-500" />
      ) : (
        <IoMoonOutline className="w-5 h-5 text-text-secondary dark:text-dark-text-secondary" />
      )}
    </button>
  );
};

export default ThemeToggleButton;
