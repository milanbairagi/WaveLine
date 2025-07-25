import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ChatList from "./pages/ChatList";
import ChatMessages from "./pages/ChatMessages";
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
        element: <ChatList />
      },
      {
        path: "/chat/:chatId",
        element: <ChatMessages />
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
