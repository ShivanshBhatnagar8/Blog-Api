const express = require("express");
const routes = express.Router();
const {
  fetchPostComments,
  fetchUserComments,
  updatingComment,
  creatingComments,
  deletingComment,
} = require("../controllers/CommentController");
const { verifyAuthToken } = require("../utils/authorization");
const { checkSchema } = require("express-validator");
const validationSchema = require("../utils/validations");

routes.get("/me", verifyAuthToken, fetchUserComments);
routes.get("/:postId", fetchPostComments);

routes.post(
  "/:postId",
  verifyAuthToken,
  checkSchema(validationSchema),
  creatingComments
);

routes.patch(
  "/:id/update",
  verifyAuthToken,
  checkSchema(validationSchema),
  updatingComment
);

routes.delete(
  "/:id/delete",
  verifyAuthToken,
  checkSchema(validationSchema),
  deletingComment
);

module.exports = routes;
