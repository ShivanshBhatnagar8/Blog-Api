import { useLocation, useParams, useNavigate, Link } from "react-router-dom";
import useSWR from "swr";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./Post.module.css";
import { useEffect } from "react";
import PostCard from "./PostCard";
import Comments from "../Comments/Comments";
import CommentCard from "../Comments/CommentCard";
import Likes from "../Likes/Likes";

function Post({ url, showSidebar, allPosts, setIsLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isGuestMode = location?.state?.guestMode;
  const { id } = useParams();
  const isSinglePost = location.pathname.startsWith("/post/");
  const postUrl = isSinglePost ? `${url}${id}` : `${url}`;
  const fetcher = (url) =>
    fetch(url, {
      credentials: "include",
    }).then((r) => r.json());

  const { data, error } = useSWR(postUrl, fetcher, {
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (isGuestMode) {
      setIsLoggedIn(false);
    }

    if (error) {
      navigate("/error", { state: { error: true } });
    }
    if (data?.isAuthorized) {
      setIsLoggedIn(true);
    }
  }, [error, data]);
  function getAllPosts() {
    navigate("/posts");
  }
  function getUnpublishedPost(e) {
    e.preventDefault();
    navigate("/posts/unpublished");
  }
  function getLoggedInUserPost(e) {
    e.preventDefault();
    navigate("/posts/me");
  }
  function getLikedPosts(e) {
    e.preventDefault();
    navigate("/posts/liked");
  }
  function getLoggedInUserComments(e) {
    e.preventDefault();
    navigate("/comments/me");
  }
  return (
    <>
      {showSidebar ? (
        <div className={styles.postsContainer}>
          {data?.isAuthorized && !isGuestMode ? (
            <div className={styles.SidebarColumn}>
              <Sidebar
                getAllPosts={getAllPosts}
                getUnpublishedPost={getUnpublishedPost}
                getLoggedInUserPost={getLoggedInUserPost}
                getLikedPosts={getLikedPosts}
                getLoggedInUserComments={getLoggedInUserComments}
              ></Sidebar>
              <div className={styles.divider}></div>
            </div>
          ) : (
            ""
          )}
          {data?.comments !== undefined ? (
            data?.comments?.length !== 0 ? (
              <CommentCard
                comments={data?.comments}
                userId={data?.userId}
              ></CommentCard>
            ) : (
              <div className={styles.noPostsContainer}>
                <h2>Oops! Looks like there is no comments !</h2>
                <Link to="/" className={styles.backLink}>
                  ← Go back to home
                </Link>
              </div>
            )
          ) : (
            ""
          )}

          {data?.posts?.length !== 0 ? (
            <div className={styles.Postbox}>
              <PostCard data={data?.posts} allPosts={allPosts}></PostCard>
            </div>
          ) : (
            <div className={styles.noPostsContainer}>
              <h2>Oops! Looks like there is no posts !</h2>
              <Link to="/" className={styles.backLink}>
                ← Go back to home
              </Link>
            </div>
          )}
        </div>
      ) : (
        <PostSection
          post={data?.post}
          isAuthorized={data?.isAuthorized}
          user={data?.user}
        />
      )}
    </>
  );
}

function PostSection({ post, isAuthorized, user }) {
  return (
    <>
      {post !== undefined ? (
        <div>
          <section className={styles.postSection}>
            <h2 className={styles.postSectionTitle}>{post?.title}</h2>
            <div className={styles.postSectionBox}>
              <p className={styles.postSectionDate}>
                <span>Created On:</span>{" "}
                {new Date(post?.createdAt).toLocaleDateString()}{" "}
              </p>
              <p className={styles.authorName}>
                <span>Written By:</span> {post?.author?.first_name}{" "}
                {post?.author?.last_name}
              </p>
            </div>
            <p className={styles.postSectionContent}>{post?.content}</p>
          </section>
          <Likes
            likeBy={post?.likeBy}
            count={post?.likes}
            userId={user?.id}
            postId={post?.id}
            isAuthorized={isAuthorized}
          ></Likes>
          <Comments
            postId={post?.id}
            comments={post?.comments}
            isAuthorized={isAuthorized}
            userId={user?.id}
          ></Comments>
        </div>
      ) : (
        <div className={styles.noPostContainer}>
          <h2>
            Oops! That post couldn’t be found. It may have been deleted or never
            existed.
          </h2>
          <Link to="/posts" className={styles.backLink}>
            ← Go back to all posts
          </Link>
        </div>
      )}
    </>
  );
}
export default Post;
