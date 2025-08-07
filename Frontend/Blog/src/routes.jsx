import Navigation from "./components/Navigation/Navigation";
import Error from "./components/Error/Error";
import Home from "./components/Home/Home";
import Form from "./components/Form/Form";
import Post from "./components/Posts/Post";
import { Navigate } from "react-router-dom";
import { URL } from "./utils/constants";
const routes = (isLoggedIn, setIsLoggedIn) => [
  {
    element: (
      <Navigation isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    ),
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home setInLoggedIn={setIsLoggedIn} />,
      },
      {
        path: "/sign-up",
        element: <Form isSignup={true} link="signup" method="POST" />,
      },
      {
        path: "/login",
        element: (
          <Form isLogin={true} method="POST" setIsLoggedIn={setIsLoggedIn} />
        ),
      },
      {
        path: "/forgot-password",
        element: (
          <Form isForgotPassword={true} link="forgotpassword" method="PATCH" />
        ),
      },
      {
        path: "create-post",
        element: isLoggedIn ? (
          <Form
            isLoggedIn={isLoggedIn}
            isCreatePost={true}
            link="posts/"
            method="POST"
          />
        ) : (
          <Navigate to="/login" />
        ),
      },
      {
        path: "/posts",
        element: (
          <Post
            url={`${URL}posts`}
            showSidebar={true}
            allPosts={true}
            setIsLoggedIn={setIsLoggedIn}
          />
        ),
      },
      {
        path: "/post/:id",
        element: (
          <Post
            url={`${URL}posts/`}
            showSidebar={false}
            setIsLoggedIn={setIsLoggedIn}
          />
        ),
      },
      {
        path: "posts/unpublished",
        element: (
          <Post
            url={`${URL}posts/unpublished`}
            showSidebar={true}
            setIsLoggedIn={setIsLoggedIn}
          />
        ),
      },
      {
        path: "posts/me",
        element: (
          <Post
            url={`${URL}posts/me`}
            showSidebar={true}
            setIsLoggedIn={setIsLoggedIn}
          />
        ),
      },
      {
        path: "posts/liked",
        element: (
          <Post
            url={`${URL}posts/liked`}
            showSidebar={true}
            allPosts={true}
            setIsLoggedIn={setIsLoggedIn}
          />
        ),
      },
      {
        path: "comments/me",
        element: (
          <Post
            url={`${URL}comments/me`}
            showSidebar={true}
            setIsLoggedIn={setIsLoggedIn}
          />
        ),
      },
    ],
  },
];
export default routes;
