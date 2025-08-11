import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

import api from "../api";
import { useUser } from "../context/userContext";
import { IoPersonOutline, IoLockClosedOutline, IoChatbubbleEllipsesOutline } from "react-icons/io5";
import useToggleTheme from "../hooks/useToggleTheme";
import ThemeToggleButton from "../components/buttons/ThemeToggleButton";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="min-h-screen bg-gradient-to-br from-neutral-bg-100 to-neutral-bg-300 dark:from-dark-bg-50 dark:to-dark-bg-100 flex items-center justify-center p-4">
      {/* Dark Mode Toggle */}
      <ThemeToggleButton /> 

      <div className="w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-0 bg-neutral-bg-100 dark:bg-dark-bg-100 rounded-2xl shadow-2xl overflow-hidden border border-neutral-bg-300 dark:border-dark-bg-300">
          
          {/* Left Panel - Branding */}
          <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-primary-500 to-primary-700 p-12 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white"></div>
              <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full bg-white"></div>
              <div className="absolute top-1/2 right-20 w-16 h-16 rounded-full bg-white"></div>
            </div>
            
            <div className="relative z-10 text-center">
              <div className="flex items-center justify-center mb-6">
                <IoChatbubbleEllipsesOutline className="w-16 h-16 text-white mr-4" />
                <h1 className="text-5xl font-bold text-white">WaveLine</h1>
              </div>
              <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                Connect, Chat, and Share moments with friends and family in real-time
              </p>
              <div className="flex space-x-4 justify-center">
                <div className="w-3 h-3 bg-white rounded-full opacity-60"></div>
                <div className="w-3 h-3 bg-white rounded-full opacity-80"></div>
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Right Panel - Login Form */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <IoChatbubbleEllipsesOutline className="w-12 h-12 text-primary-500 mr-3" />
                <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">WaveLine</h1>
              </div>
              <p className="text-text-secondary dark:text-dark-text-secondary">Welcome back! Sign in to continue</p>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block mb-8">
              <h2 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary mb-2">Welcome Back</h2>
              <p className="text-text-secondary dark:text-dark-text-secondary">Sign in to your account to continue chatting</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-text-primary dark:text-dark-text-primary">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <IoPersonOutline className="h-5 w-5 text-text-tertiary dark:text-dark-text-tertiary" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3 border border-neutral-bg-300 dark:border-dark-bg-100 rounded-xl bg-neutral-bg-200 dark:bg-dark-bg-200 text-text-primary dark:text-dark-text-primary placeholder-text-tertiary dark:placeholder-dark-text-tertiary focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your username"
                    required
                    
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-text-primary dark:text-dark-text-primary">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <IoLockClosedOutline className="h-5 w-5 text-text-tertiary dark:text-dark-text-tertiary" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3 border border-neutral-bg-300 dark:border-dark-bg-300 rounded-xl bg-neutral-bg-200 dark:bg-dark-bg-200 text-text-primary dark:text-dark-text-primary placeholder-text-tertiary dark:placeholder-dark-text-tertiary focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 mt-4 border border-transparent rounded-xl shadow-lg text-white font-medium transition-all duration-200 ${
                  loading
                    ? 'bg-primary-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 focus:ring-4 focus:ring-primary-200 transform hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-8 text-center">
              <p className="text-text-secondary dark:text-dark-text-secondary">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
                >
                  Create one now
                </Link>
              </p>
            </div>

            {/* Features */}
            <div className="mt-8 pt-8 border-t border-neutral-bg-300 dark:border-dark-bg-300">
              <div className="grid grid-cols-3 gap-4 text-center">

                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-dark-bg-200 rounded-lg flex items-center justify-center mb-2">
                    <span className=" text-sm font-bold">🗨️</span>
                  </div>
                  <span className="text-xs text-text-secondary dark:text-dark-text-secondary">Real-time Chat</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-accent-100 dark:bg-dark-bg-200 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-accent-600 dark:text-accent-400 text-sm font-bold">🔒</span>
                  </div>
                  <span className="text-xs text-text-secondary dark:text-dark-text-secondary">Secure</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-dark-bg-200 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-primary-600 dark:text-primary-400 text-sm font-bold">⚡</span>
                  </div>
                  <span className="text-xs text-text-secondary dark:text-dark-text-secondary">Fast</span>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
	);
};

export default Login;