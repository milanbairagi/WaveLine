import { useUser } from "../../context/userContext"
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";

const Logout = () => {
    const { setUser } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        setUser(null);
        navigate("/login");
    };

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );
};

export default Logout;