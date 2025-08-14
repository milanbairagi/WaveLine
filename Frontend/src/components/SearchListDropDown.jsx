import Avatar from "./Avatar";

const SearchListDropDown = ({ users, updateSearchTerm, handleClick }) => {
	return (
		<div className="w-64 bg-white dark:bg-dark-bg-100 dark:text-dark-text-primary rounded-lg shadow-lg p-4 z-20">
			<input
				type="text"
				placeholder="Search..."
				onChange={(e) => updateSearchTerm(e.target.value)}
        className="w-full px-3 py-2 border border-neutral-bg-400 dark:border-dark-bg-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
			/>
			<ul>
				{users.map((user) => (
					<li
						key={user.id}
						onClick={() => handleClick(user.id)}
						className="flex items-center cursor-pointer hover:bg-neutral-bg-300 dark:hover:bg-dark-bg-200 p-2 rounded"
					>
            <Avatar name={user.username} style="w-10 h-10 mr-2" />
						{user.username}
					</li>
				))}
			</ul>
		</div>
	);
};

export default SearchListDropDown;
