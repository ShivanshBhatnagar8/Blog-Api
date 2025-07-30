const express = require("express");
const routes = express.Router();
const {
  fetchAllPosts,
  fetchPost,
  fetchAllPostsForUser,
  fetchAllUnpublishedPosts,
  fetchLikedPosts,
  makePublishPosts,
  makeUnPublishPosts,
  toggleLikePost,
  togglePostStatus,
  changingPost,
  deletingPost,
} = require("../controllers/PostController");
const { verifyAuthToken } = require("../utils/authorization");
const { checkSchema } = require("express-validator");
const validationSchema = require("../utils/validations");

routes.get("/", fetchAllPosts);
routes.get("/me", verifyAuthToken, fetchAllPostsForUser);
routes.get("/unpublished", verifyAuthToken, fetchAllUnpublishedPosts);
routes.get("/liked", verifyAuthToken, fetchLikedPosts);
routes.get("/:id", fetchPost);

routes.post(
  "/publish",
  checkSchema(validationSchema),
  verifyAuthToken,
  makePublishPosts
);
routes.post(
  "/unpublish",
  checkSchema(validationSchema),
  verifyAuthToken,
  makeUnPublishPosts
);

routes.patch("/:id/liked", verifyAuthToken, toggleLikePost);

routes.patch("/:id/status", verifyAuthToken, togglePostStatus);
routes.patch(
  "/:id/update",
  verifyAuthToken,
  checkSchema(validationSchema),
  changingPost
);

routes.delete("/:id/delete", verifyAuthToken, deletingPost);

module.exports = routes;
