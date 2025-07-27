import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

const Register = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleRegister = async (event) => {
		event.preventDefault();
		const userData = {username, password};

		try {
			setLoading(true);
			const response = await api.post("accounts/register/", userData);
			console.log("Registration successful:", response.data);
			localStorage.setItem(ACCESS_TOKEN, response.data.access);
			localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
			navigate("/");
		} catch (error) {
			console.error("Registration failed:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<h1>Register Page</h1>
			<form onSubmit={handleRegister}>
				<div>
					<label htmlFor="username">Username:</label>
					<input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
				</div>
				<div>
					<label htmlFor="password">Password:</label>
					<input
						type="password"
						id="password"
						name="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<div>
					<label htmlFor="confirmPassword">Confirm Password:</label>
					<input
						type="password"
						id="confirmPassword"
						name="confirmPassword"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>
				</div>
				<button type="submit" disabled={loading}>
					{loading ? "Registering..." : "Register"}
				</button>
			</form>
		</div>
	);
};

export default Register;
