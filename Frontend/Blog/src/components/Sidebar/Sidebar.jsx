import styles from "./Sidebar.module.css";

function Sidebar({
  getAllPosts,
  getUnpublishedPost,
  getLoggedInUserPost,
  getLikedPosts,
  getLoggedInUserComments,
}) {
  return (
    <>
      <div className={styles.SidebarContainer}>
        <div className={styles.SidebarSection} onClick={(e) => getAllPosts(e)}>
          <p className={styles.SidebarSectionName}>All Posts</p>
        </div>
        <div
          className={styles.SidebarSection}
          onClick={(e) => getLoggedInUserPost(e)}
        >
          <p className={styles.SidebarSectionName}>Your Posts</p>
        </div>
        <div
          className={styles.SidebarSection}
          onClick={(e) => getUnpublishedPost(e)}
        >
          <p className={styles.SidebarSectionName}>Unpublished Posts</p>
        </div>
        <div
          className={styles.SidebarSection}
          onClick={(e) => getLikedPosts(e)}
        >
          <p className={styles.SidebarSectionName}>Liked Posts</p>
        </div>
        <div
          className={styles.SidebarSection}
          onClick={(e) => getLoggedInUserComments(e)}
        >
          <p className={styles.SidebarSectionName}>Your Comments</p>
        </div>
      </div>
    </>
  );
}
export default Sidebar;
