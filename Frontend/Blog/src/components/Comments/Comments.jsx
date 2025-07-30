/* eslint-disable no-unused-vars */
import styles from "./Comments.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { URL } from "../../utils/constants";

function Comments({ postId, comments, isAuthorized, userId }) {
  const [body, setBody] = useState({});
  const [data, setData] = useState(comments);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    setData(comments);
  }, [userId, comments]);
  async function createComment(id) {
    try {
      const response = await fetch(`${URL}comments/${id}`, {
        method: "POST",
        withCredentials: true,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (response.status === 200) {
        setData([...data, result.createdComment]);
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

  function handleTextAreaChange(name, value) {
    setBody({
      ...body,
      [name]: value,
    });
  }

  function handleButtonClick(e) {
    createComment(e.target.dataset.id);
    setBody({ comment: "" });
  }
  return (
    <>
      <div className={styles.commentSection}>
        {isAuthorized ? (
          <div className={styles.commentInputBox}>
            <textarea
              className={styles.commentInput}
              placeholder="Write your comment..."
              name="comment"
              rows={3}
              maxLength="255"
              value={body.comment}
              onChange={(e) =>
                handleTextAreaChange(e.target.name, e.target.value)
              }
            />
            {error !== null ? (
              <p className={styles.errormessage}>{error}</p>
            ) : (
              ""
            )}
            <button
              data-id={postId}
              className={styles.commentButton}
              onClick={(e) => handleButtonClick(e)}
            >
              Post Comment
            </button>
          </div>
        ) : (
          ""
        )}
        {data.length !== 0 ? (
          <div className={styles.commentList}>
            {data.map((comment) => (
              <div className={styles.commentItem} key={comment.id}>
                <div className={styles.commentHeader}>
                  <span className={styles.commentAuthor}>
                    {comment.author.first_name} {comment.author.last_name}
                  </span>
                  <span className={styles.commentDate}>
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className={styles.commentText}>{comment.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <h2>No Comments</h2>
        )}
      </div>
    </>
  );
}
export default Comments;
