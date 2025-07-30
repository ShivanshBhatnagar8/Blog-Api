import styles from "./Error.module.css";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import PageNotFoundImg from "../../assets/img/Page_Not_Found.png";
import ServerErrorImg from "../../assets/img/Server_Error.png";

function Error({ isServerError }) {
  const location = useLocation();
  if (location?.state?.error) {
    isServerError = true;
  }
  return (
    <>
      {isServerError ? (
        <div className={styles.errorContainer}>
          <img src={ServerErrorImg} alt="Server Error" />
          <h2>We hit a snag while trying to load the page.</h2>
          <p className={styles.error}>
            Even great stories have plot twists. Hang tight, we’re working on
            it.
          </p>
          <Link className={styles.homeLink} to="/">
            Go back home
          </Link>
        </div>
      ) : (
        <div className={styles.errorContainer}>
          <img src={PageNotFoundImg} alt="Page not found" />
          <h2>Oops! This Page Flew the Nest</h2>
          <p className={styles.error}>
            Looks like the page you’re looking for doesn’t exist or has been
            moved. But don’t worry — your words still matter. Let’s get you back
            where the stories live.
          </p>
          <Link className={styles.homeLink} to="/">
            Go back home
          </Link>
        </div>
      )}
    </>
  );
}

export default Error;
