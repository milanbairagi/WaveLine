import { useState, useEffect, useContext, createContext } from "react";

import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	const fetchUser = async () => {
		try {
			setLoading(true);
			const response = await api.get("/accounts/user/");
			setUser(response.data);
		} catch (error) {
			console.error("Error fetching user:", error);
			setUser(null);
		} finally {
			setLoading(false);
		}
	};

	const loginUser = async (tokens) => {
		try {
			// Store tokens
			localStorage.setItem(ACCESS_TOKEN, tokens.access);
			localStorage.setItem(REFRESH_TOKEN, tokens.refresh);
			
			// Fetch and set user data
			const userResponse = await api.get("/accounts/user/");
			setUser(userResponse.data);
			
			return userResponse.data;
		} catch (error) {
			console.error("Error setting user after login:", error);
			// Clear tokens if user fetch fails
			localStorage.removeItem(ACCESS_TOKEN);
			localStorage.removeItem(REFRESH_TOKEN);
			throw error;
		}
	};

	const logoutUser = () => {
		localStorage.removeItem(ACCESS_TOKEN);
		localStorage.removeItem(REFRESH_TOKEN);
		setUser(null);
	};

	useEffect(() => {
		fetchUser();
	}, []);

	return (
		<UserContext.Provider value={{ user, setUser, loading, fetchUser, loginUser, logoutUser }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => {
	return useContext(UserContext);
};
