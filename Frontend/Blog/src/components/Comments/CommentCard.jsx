/* eslint-disable no-unused-vars */
import styles from "./Comments.module.css";
import { useNavigate } from "react-router";
import { URL } from "../../utils/constants";
import { useEffect, useState } from "react";
function CommentCard({ comments, userId }) {
  const navigate = useNavigate();
  const [data, setData] = useState(comments);
  const [body, setBody] = useState({});
  const [error, setError] = useState("");
  const [commentId, setCommentId] = useState("");

  useEffect(() => {
    setData(comments);
  }, [userId, comments]);
  async function updateComment(commentId) {
    try {
      const response = await fetch(`${URL}comments/${commentId}/update`, {
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
            if (el.id === Number(commentId)) {
              el.content = body.comment;
              el.updatedAt = new Date(Date.now());
              return el;
            } else {
              return el;
            }
          })
        );
        setCommentId("");
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
  async function deleteComment(commentId) {
    try {
      const response = await fetch(`${URL}comments/${commentId}/delete`, {
        method: "DELETE",
        withCredentials: true,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      if (response.status === 200) {
        setData(data.filter((el) => el.id !== result.comment.id));
      }
      if (response.status === 500) {
        navigate("/error", { state: { error: true } });
      }
    } catch (error) {
      navigate("/error", { state: { error: true } });
    }
  }

  function commentUpdateHandler(e) {
    updateComment(e.currentTarget.dataset.id);
    setBody({});
  }
  function handleDeleteComment(e) {
    deleteComment(e.currentTarget.dataset.id);
  }

  function toggleUpdateStatus(e) {
    e.stopPropagation();
    const id = e.currentTarget.dataset.id;
    setCommentId((prev) => {
      const newId = prev === id ? "" : id;
      return newId;
    });
  }

  function handleCommentChange(name, value, id) {
    setBody(id === commentId ? { ...body, [name]: value } : body);
  }
  return (
    <>
      <div className={styles.commentCardContainer}>
        {data?.map((comment) => (
          <div className={styles.commentCard} key={comment.id}>
            <div className={styles.cardHeader}>
              <span className={styles.commentDate}>
                {" "}
                Created:
                {new Date(comment.createdAt).toLocaleString()}
              </span>
              <span className={styles.commentDate}>
                {" "}
                Updated:
                {new Date(comment.updatedAt).toLocaleString()}
              </span>
            </div>
            {Number(commentId) !== comment.id ? (
              <div className={styles.cardContentBox}>
                <p className={styles.commentContent}>
                  <strong>{comment.content}</strong>
                </p>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-pencil-square"
                  viewBox="0 0 16 16"
                  data-id={comment.id}
                  onClick={(e) => toggleUpdateStatus(e)}
                >
                  <path
                    data-id={comment.id}
                    d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
                  />
                  <path
                    data-id={comment.id}
                    fillRule="evenodd"
                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                  />
                </svg>
              </div>
            ) : (
              <div className={styles.updateBox}>
                <label htmlFor="comment">
                  <input
                    type="text"
                    maxLength={255}
                    name="comment"
                    value={body.comment}
                    required
                    data-id={comment.id}
                    onChange={(e) =>
                      handleCommentChange(
                        e.target.name,
                        e.target.value,
                        e.target.dataset.id
                      )
                    }
                  />
                </label>
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
                    data-id={comment.id}
                    onClick={(e) => commentUpdateHandler(e)}
                  >
                    <path
                      data-id={comment.id}
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
                    data-id={comment.id}
                    onClick={(e) => toggleUpdateStatus(e)}
                  >
                    <path
                      data-id={comment.id}
                      d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"
                    />
                  </svg>
                </div>
              </div>
            )}

            <button
              data-id={comment.id}
              className={styles.commentButton}
              onClick={(e) => handleDeleteComment(e)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
export default CommentCard;
