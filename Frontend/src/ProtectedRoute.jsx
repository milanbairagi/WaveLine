import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "./context/userContext";


const ProtectedRoute = () => {
	const { user, loading } = useUser();
    console.log("ProtectedRoute user:", user);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    };

    return <Outlet />;
};

export default ProtectedRoute;