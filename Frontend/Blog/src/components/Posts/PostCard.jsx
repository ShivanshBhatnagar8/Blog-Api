/* eslint-disable no-unused-vars */
import { URL } from "../../utils/constants";
import styles from "./Post.module.css";
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router";

function PostCard({ data, allPosts }) {
  const [error, setError] = useState("");
  const [postData, setData] = useState(data);
  const [body, setBody] = useState({});
  const [postId, setPostId] = useState("");
  const [toggleUpdate, setToggleUpdate] = useState(false);

  const navigate = useLocation();
  useEffect(() => {
    setData(data);
  }, [data]);

  async function statusUpdate(postId) {
    try {
      const response = await fetch(`${URL}posts/${postId}/status`, {
        method: "PATCH",
        withCredentials: true,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      if (response.status === 200) {
        setData(
          data.map((el) => {
            if (el.id === Number(postId)) {
              el.published = !el.published;
              el.updatedAt = new Date(Date.now());
              return el;
            } else {
              return el;
            }
          })
        );
      } else {
        setError(result.errors[0]);
      }
      if (response.status === 500) {
        navigate("/error", { state: { error: true } });
      }
    } catch (error) {
      navigate("/error", { state: { error: true } });
    }
  }

  async function updatePost(postId) {
    try {
      const response = await fetch(`${URL}posts/${postId}/update`, {
        method: "PATCH",
        withCredentials: true,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (response.status === 200) {
        setData(
          data.map((el) => {
            if (el.id === Number(postId)) {
              el.title = body.title;
              el.content = body.content;
              el.updatedAt = new Date(Date.now());
              return el;
            } else {
              return el;
            }
          })
        );
        setPostId("");
        setToggleUpdate(false);
      } else {
        setError(result.errors[0]);
      }
      if (response.status === 500) {
        navigate("/error", { state: { error: true } });
      }
    } catch (error) {
      navigate("/error", { state: { error: true } });
    }
  }
  async function deletePost(postId) {
    try {
      const response = await fetch(`${URL}posts/${postId}/delete`, {
        method: "DELETE",
        withCredentials: true,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      if (response.status === 200) {
        setData(data.filter((el) => el.id !== result.post.id));
      }
      if (response.status === 500) {
        navigate("/error", { state: { error: true } });
      }
    } catch (error) {
      navigate("/error", { state: { error: true } });
    }
  }

  function toggleStatus(e) {
    statusUpdate(e.currentTarget.dataset.id);
  }
  function handlePostDelete(e) {
    deletePost(e.currentTarget.dataset.id);
  }

  function postUpdateHandler(e) {
    updatePost(e.currentTarget.dataset.id);
  }
  function handlePostUpdate(e) {
    e.preventDefault();
    setToggleUpdate((prev) => !prev);
    const id = e.currentTarget.dataset.id;
    setPostId((prev) => {
      const newId = prev === id ? "" : id;
      return newId;
    });
  }
  function handlePostChange(name, value, id) {
    setBody(id === postId ? { ...body, [name]: value } : body);
  }

  return (
    <>
      {postData?.map((post) => (
        <div className={styles.postTile} key={post.id}>
          <h2 className={styles.postTileTitle}>{post.title}</h2>
          <p className={styles.postTileContent}>{post.content}</p>
          {!allPosts ? (
            !toggleUpdate ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-pencil-square"
                viewBox="0 0 16 16"
                data-id={post.id}
                onClick={(e) => handlePostUpdate(e)}
              >
                <path
                  data-id={post.id}
                  d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
                />
                <path
                  data-id={post.id}
                  fillRule="evenodd"
                  d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                />
              </svg>
            ) : (
              <div className={styles.postUpdateBox}>
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  maxLength={100}
                  name="title"
                  // value={body.comment}
                  required
                  data-id={post.id}
                  onChange={(e) =>
                    handlePostChange(
                      e.target.name,
                      e.target.value,
                      e.target.dataset.id
                    )
                  }
                />

                <label htmlFor="content">Content </label>
                <textarea
                  type="text"
                  minLength={10}
                  maxLength={10000}
                  name="content"
                  className={styles.postContent}
                  // value={body.comment}
                  required
                  data-id={post.id}
                  onChange={(e) =>
                    handlePostChange(
                      e.target.name,
                      e.target.value,
                      e.target.dataset.id
                    )
                  }
                />

                {error !== null ? (
                  <p className={styles.errormessage}>{error}</p>
                ) : (
                  ""
                )}
                <div className={styles.svgContainer}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-check2"
                    viewBox="0 0 16 16"
                    data-id={post.id}
                    onClick={(e) => postUpdateHandler(e)}
                  >
                    <path
                      data-id={post.id}
                      d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-x"
                    viewBox="0 0 16 16"
                    data-id={post.id}
                    onClick={(e) => handlePostUpdate(e)}
                  >
                    <path
                      data-id={post.id}
                      d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"
                    />
                  </svg>
                </div>
              </div>
            )
          ) : (
            ""
          )}
          <div className={styles.postTileBox}>
            {allPosts ? (
              <div className={styles.buttonContainer}>
                <Link
                  data-id={post.id}
                  className={styles.postLink}
                  to={`/post/${post.id}`}
                >
                  Click here to view the post &rarr;
                </Link>
              </div>
            ) : (
              <div className={styles.buttonContainer}>
                <button
                  data-id={post.id}
                  onClick={(e) => toggleStatus(e)}
                  className={styles.markButton}
                >
                  {" "}
                  {post?.published ? "Unpublish Post" : "Publish Post"}
                </button>
                <button
                  data-id={post.id}
                  onClick={(e) => handlePostDelete(e)}
                  className={styles.markButton}
                >
                  {" "}
                  Delete
                </button>
              </div>
            )}

            <p className={styles.postTileDate}>
              {new Date(post.createdAt).toLocaleDateString()}{" "}
            </p>
          </div>
        </div>
      ))}
    </>
  );
}
export default PostCard;
