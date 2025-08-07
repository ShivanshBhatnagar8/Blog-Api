/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { API_KEY, URL, fieldKeywords } from "../../utils/constants";
import styles from "./Form.module.css";
import { Editor } from "@tinymce/tinymce-react";
function Form({
  isLogin,
  isSignup,
  isForgotPassword,
  isCreatePost,
  link,
  method,
  setIsLoggedIn,
  isLoggedIn,
}) {
  const [body, setBody] = useState({});
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setBody({});
    setError({});
  }, [location.pathname]);

  function handleChange(name, value) {
    setBody({
      ...body,
      [name]: value,
    });
  }

  async function postFunction() {
    try {
      const response = await fetch(
        link !== undefined ? `${URL}${link}` : `${URL}`,
        {
          method: method,
          withCredentials: true,
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await response.json();
      if (response.status === 200) {
        if (isSignup || isForgotPassword) {
          navigate("/login");
          toast.success(data, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });

          setError({});
        }
        if (isLogin) {
          navigate("/posts");
          setIsLoggedIn(true);
          setError({});
        }
        if (isCreatePost && isLoggedIn) {
          navigate("/posts");
          setError({});
        }
      } else if (response.status === 500) {
        navigate("/error", { state: { error: true } });
      } else {
        const responseErrors =
          data["errors"] !== undefined ? data["errors"] : [data];
        const newErrors = {};

        responseErrors.forEach((element) => {
          for (const fields in fieldKeywords) {
            if (element.toLowerCase().includes(fields)) {
              const field = fieldKeywords[fields];
              newErrors[field] = element;

              break;
            }
            setError(newErrors);
          }
        });
      }
    } catch (error) {
      navigate("/error", { state: { error: true } });
    }
  }
  function handleSubmit(e) {
    e.preventDefault();
    postFunction();
  }

  function validation() {
    if (body.title !== undefined && body.content !== undefined) {
      return true;
    } else if (body.title === undefined) {
      setError({
        ["title"]:
          "Title must be between 10 and 100 words. It cannot be empty. ",
      });

      return false;
    } else if (body.content === undefined) {
      setError({ ["content"]: "Content cannot be empty" });
      return false;
    }
  }
  function handlePublishPost(e) {
    e.preventDefault();
    if (validation()) {
      link += "publish";
      postFunction();
    }
  }
  function handleUnPublishPost(e) {
    e.preventDefault();
    if (validation()) {
      link += "unpublish";
      postFunction();
    }
  }
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
        className={styles.toast}
      />

      <form action="/" method="POST" onSubmit={(e) => handleSubmit(e)}>
        <Input
          isLogin={isLogin}
          isSignup={isSignup}
          isForgotPassword={isForgotPassword}
          isCreatePost={isCreatePost}
          handleChange={handleChange}
          handlePublishPost={handlePublishPost}
          handleUnPublishPost={handleUnPublishPost}
          body={body}
          error={error}
        ></Input>
      </form>
    </>
  );
}
function Input({
  isLogin,
  isSignup,
  isForgotPassword,
  isCreatePost,
  handleChange,
  handlePublishPost,
  handleUnPublishPost,
  body,
  error,
}) {
  if (isLogin) {
    return (
      <>
        <label htmlFor="username">User Name</label>
        <input
          id="username"
          name="email"
          placeholder="Email"
          type="email"
          value={body.email || ""}
          required
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
        {error.username ? <p className={styles.error}>{error.username}</p> : ""}
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={body.password || ""}
          maxLength="6"
          required
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
        {error.password ? <p className={styles.error}>{error.password}</p> : ""}
        <Link className={styles.formLink} to="/forgot-password">
          Forgot Password ?
        </Link>
        <button>Log In</button>
        <p className={styles.registration}>
          New User? Register{" "}
          <Link className={styles.formLink} to="/sign-up">
            here.
          </Link>
        </p>
      </>
    );
  }
  if (isSignup) {
    return (
      <>
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          name="firstName"
          placeholder="First Name"
          type="text"
          value={body.firstName || ""}
          maxLength="20"
          required
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
        {error.firstName ? (
          <p className={styles.error}>{error.firstName}</p>
        ) : (
          ""
        )}
        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          name="lastName"
          placeholder="Last Name"
          type="text"
          value={body.lastName || ""}
          maxLength="20"
          required
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
        {error.lastName ? <p className={styles.error}>{error.lastName}</p> : ""}
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          placeholder="Email"
          type="email"
          value={body.email || ""}
          required
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
        {error.email ? <p>{error.email}</p> : ""}
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          maxLength="6"
          value={body.password || ""}
          required
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
        {error.password ? <p className={styles.error}>{error.password}</p> : ""}
        <label htmlFor="confirmPassword"> Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          maxLength="6"
          value={body.confirmPassword || ""}
          required
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
        {error.confirmpassword ? <p>{error.confirmpassword}</p> : ""}
        <button type="submit">Sign Up</button>
        {error.username ? <p className={styles.error}>{error.username}</p> : ""}
      </>
    );
  }
  if (isForgotPassword) {
    return (
      <>
        <label htmlFor="username">User Name</label>
        <input
          id="username"
          name="email"
          placeholder="Email"
          type="email"
          value={body.email || ""}
          required
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
        {error.email ? <p className={styles.error}>{error.email}</p> : ""}
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={body.password || ""}
          maxLength="6"
          required
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
        {error.password ? <p className={styles.error}>{error.password}</p> : ""}
        <label htmlFor="confirmPassword"> Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          maxLength="6"
          value={body.confirmPassword || ""}
          required
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
        {error.confirmPassword ? (
          <p className={styles.error}>{error.confirmPassword}</p>
        ) : (
          ""
        )}
        <button>Submit</button>
        <Link className={styles.formLink} to="/login">
          Return to Login Page
        </Link>
      </>
    );
  }
  if (isCreatePost) {
    return (
      <>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          placeholder="title"
          type="text"
          value={body.title || ""}
          minLength="10"
          maxLength="255"
          required
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
        {error.title ? <p className={styles.error}>{error.title}</p> : ""}
        <label htmlFor="Content">Content</label>
        {/* <textarea
          id="content"
          name="content"
          placeholder="Content"
          type="text"
          value={body.content || ""}
          minLength="10"
          maxLength="10000"
          required
          className={styles.postContent}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        /> */}
        <Editor
          apiKey={API_KEY}
          textareaName="content"
          name="content"
          minLength="10"
          maxLength="10000"
          init={{
            plugins: [
              "anchor",
              "autolink",
              "charmap",
              "codesample",
              "emoticons",
              "image",
              "link",
              "lists",
              "media",
              "searchreplace",
              "table",
              "visualblocks",
              "wordcount",
            ],
            toolbar:
              "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
          }}
          onEditorChange={(value, editor) =>
            handleChange(
              editor.getElement().name,
              editor.getContent({ format: "text" })
            )
          }
        />
        {error.content ? <p className={styles.error}>{error.content}</p> : ""}
        <div className={styles.buttonContainer}>
          <button type="submit" onClick={(e) => handlePublishPost(e)}>
            Publish Post
          </button>
          <button type="submit" onClick={(e) => handleUnPublishPost(e)}>
            Unpublish Post
          </button>
        </div>
      </>
    );
  }
}

export default Form;
