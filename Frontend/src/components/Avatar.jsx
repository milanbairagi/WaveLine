const Avatar = ({ name, style }) => {
	return (
		<div className={`w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold ${style}`}>
			{name.charAt(0).toUpperCase() || "C"}
		</div>
	);
};

export default Avatar;