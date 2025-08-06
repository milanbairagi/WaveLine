import { useUser } from "../../context/userContext"
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const { logoutUser } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    };

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );
};

export default Logout;