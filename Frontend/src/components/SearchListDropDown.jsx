

const SearchListDropDown = ({ users, updateSearchTerm, handleClick }) => {
    return (
        <>
            <input type="text" placeholder="Search..." onChange={(e) => updateSearchTerm(e.target.value)} />
            <ul>
                {users.map((user) => (
                    <li 
                      key={user.id} 
                      onClick={() => handleClick(user.id)}
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-bg-300 p-2 rounded"
                    >
                      {user.username}
                    </li>
                ))}
            </ul>
        </>
    );
};

export default SearchListDropDown;