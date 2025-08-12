import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MainLayout from "./pages/MainLayout";
import ChatMessages from "./components/ChatMessages";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { UserProvider } from "./context/userContext";
import ProtectedRoute from "./ProtectedRoute";

let router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <MainLayout />
      },
      {
        path: "/chat/:chatId",
        element: <MainLayout />
      }
    ]
  }
]);

function App() {

  return (
    <>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </>
  )
}

export default App
