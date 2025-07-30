import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./routes";
import "./styles/index.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = createBrowserRouter(routes(isLoggedIn, setIsLoggedIn));

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
