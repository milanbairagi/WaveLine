import { useState, useEffect, useContext, createContext } from "react";

import api from "../api";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await api.get("/accounts/user/");
				setUser(response.data);
			} catch (error) {
				console.error("Error fetching user:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

	return (
		<UserContext.Provider value={{ user, setUser, loading }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => {
	return useContext(UserContext);
};
