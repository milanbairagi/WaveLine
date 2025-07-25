import { createBrowserRouter, RouterProvider } from "react-router-dom"

import ChatList from "./ChatList"
import ChatMessages from "./ChatMessages"

let router = createBrowserRouter([
  {
    path: "/",
    element: <ChatList />,
  },

  {
    path: "/chat/:chatId",
    element: <ChatMessages />,
  }
])

function App() {

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
