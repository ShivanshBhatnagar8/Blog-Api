import Navigation from "./components/Navigation/Navigation";
import Error from "./components/Error/Error";
import Home from "./components/Home/Home";
import Form from "./components/Form/Form";
import Post from "./components/Posts/Post";
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
        element: <Form isCreatePost={true} link="posts/" method="POST" />,
      },
      {
        path: "/posts",
        element: (
          <Post url={`${URL}posts`} showSidebar={true} allPosts={true} />
        ),
      },
      {
        path: "/post/:id",
        element: <Post url={`${URL}posts/`} showSidebar={false} />,
      },
      {
        path: "posts/unpublished",
        element: <Post url={`${URL}posts/unpublished`} showSidebar={true} />,
      },
      {
        path: "posts/me",
        element: <Post url={`${URL}posts/me`} showSidebar={true} />,
      },
      {
        path: "posts/liked",
        element: (
          <Post url={`${URL}posts/liked`} showSidebar={true} allPosts={true} />
        ),
      },
      {
        path: "comments/me",
        element: <Post url={`${URL}comments/me`} showSidebar={true} />,
      },
    ],
  },
];
export default routes;
