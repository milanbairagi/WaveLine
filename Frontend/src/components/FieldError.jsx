import { IoWarningOutline } from "react-icons/io5";

const FieldError = ({ msg }) => {
	return (
		<div className="flex items-center mt-1 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400 rounded px-2 py-1 gap-1">
			<IoWarningOutline className="w-4 h-4 flex-shrink-0" />
			<span>{msg}</span>
		</div>
	);
};

export default FieldError;
