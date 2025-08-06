import { useNavigate } from "react-router-dom";
import { useState } from "react";

import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useUser } from "../context/userContext";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useUser();

	const handleLogin = async (event) => {
		event.preventDefault();
		const formData = new FormData(event.target);
		const credentials = {
			username: formData.get("username"),
			password: formData.get("password"),
		};

		try {
      setLoading(true);
			const response = await api.post("/token/", credentials);
			
			// Use the centralized login function
			await loginUser(response.data);
			
      navigate("/");
		} catch (error) {
			console.error("Login failed:", error);
		} finally {
      setLoading(false);
    }
	};

	return (
		<div className="login-page">
			<h2>Login</h2>
      {loading && <p>Loading...</p>}
			<form onSubmit={handleLogin}>
				<div>
					<label htmlFor="username">Username:</label>
					<input type="text" id="username" name="username" required />
				</div>
				<div>
					<label htmlFor="password">Password:</label>
					<input
						type="password"
						id="password"
						name="password"
						required
					/>
				</div>
				<button type="submit">Login</button>
			</form>
		</div>
	);
};

export default Login;