/* eslint-disable no-unused-vars */
import styles from "./Navigation.module.css";
import { URL } from "../../utils/constants";
import { Link, Outlet, useNavigate } from "react-router-dom";

function Navigation({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  async function logout() {
    try {
      const response = await fetch(`${URL}logout`, {
        method: "POST",
        withCredentials: true,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 500) {
        navigate("/error", { state: { error: true } });
      }
    } catch (error) {
      navigate("/error", { state: { error: true } });
    }
  }
  function handleLogOut() {
    logout();
    setIsLoggedIn(false);
  }
  return (
    <>
      <header className={styles.header}>
        <nav className={styles.navigation}>
          <div>
            <h1 className={styles.heading}>Text Nest</h1>
          </div>
          <div className={styles.links}>
            <Link className={styles.link} to="/">
              Home
            </Link>
            {isLoggedIn ? (
              <>
                <Link className={styles.link} to="/create-post">
                  Create Post
                </Link>
                <Link
                  className={styles.link}
                  to="/"
                  state={{ guestMode: true }}
                  onClick={handleLogOut}
                >
                  Log Out
                </Link>
              </>
            ) : (
              <>
                <Link className={styles.link} to="/sign-up">
                  Sign-up
                </Link>
                <Link className={styles.link} to="/login">
                  Login
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <Outlet />
    </>
  );
}
export default Navigation;
