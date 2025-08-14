import axios from "axios";

import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

// Create an Axios instance with a base URL and timeout
const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	timeout: 10000,
});

// Add a request interceptor to include the access token in the headers
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem(ACCESS_TOKEN);
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

api.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		const originalRequest = error.config;

		// If the error is a 401 Unauthorized and the request has not been retried yet
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			const refreshToken = localStorage.getItem(REFRESH_TOKEN);
			if (refreshToken) {
				try {
					const response = await axios.post(
						`${import.meta.env.VITE_API_URL}/token/refresh/`,
						{
							refresh: refreshToken,
						}
					);
					localStorage.setItem(ACCESS_TOKEN, response.data.access);
					originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
					return api(originalRequest);
				} catch (refreshError) {
					console.error("Refresh token failed:", refreshError);
				}
			}
		}

    return Promise.reject(error);
	}
);

export default api;
