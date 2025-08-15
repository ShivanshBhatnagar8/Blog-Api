/* eslint-disable no-unused-vars */
import { Link } from "react-router";
import styles from "./Home.module.css";
import { URL } from "../../utils/constants";
import bookImage from "../../assets/img/Books.png";
import { useNavigate } from "react-router";
import WritingImage from "../../assets/img/Writing.png";
import BlogImage from "../../assets/img/Blog.png";

function Home({ setInLoggedIn, isLoggedIn }) {
  const navigate = useNavigate();
  async function guestMode() {
    try {
      const response = await fetch(`${URL}logout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      setInLoggedIn(false);
      if (response.status === 500) {
        navigate("/error", { state: { error: true } });
      }
    } catch (error) {
      navigate("/error", { state: { error: true } });
    }
  }
  function click() {
    guestMode();
  }

  return (
    <>
      <main>
        <div className={styles.mainContent}>
          <p>
            Welcome to the platform where ideas turn into impact. Whether you're
            a seasoned writer or just getting started, here you can draft, edit,
            and publish your thoughts with ease. Share your knowledge, tell your
            story, or build your personal brand — all from one intuitive space
            designed to empower your voice. No clutter. No noise. Just you and
            your words, exactly how you want them.
          </p>
        </div>
        <div className={styles.secondContent}>
          <p>Every post is a page in your journey. Make it meaningful.</p>
        </div>

        <div className={styles.btnContainer}>
          <Link className={styles.loginBtn} to="/login">
            Continue with Account
          </Link>
          <Link
            className={styles.guestBtn}
            to="/posts"
            state={{ guestMode: true }}
            onClick={(e) => click(e)}
          >
            Explore as Guest
          </Link>
        </div>

        <div className={styles.imageCollage}>
          <img src={bookImage} alt="Image 1" className={styles.topImg} />
          <img src={WritingImage} alt="Image 2" className={styles.middleImg} />
          <img src={BlogImage} alt="Image 3" className={styles.bottomImg} />
        </div>

        <div className={styles.mobileDiv}></div>
      </main>
    </>
  );
}
export default Home;
