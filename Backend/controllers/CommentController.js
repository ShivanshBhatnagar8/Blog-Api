const {
  getPostComments,
  getUserComments,
  updateComment,
  createComment,
  deleteComment,
  getPostById,
} = require("../db/queries");
const { validationResult } = require("express-validator");

async function fetchPostComments(req, res) {
  try {
    if (req.params.postId) {
      if (!req.params.postId || isNaN(req.params.postId)) {
        return res.status(400).json("Invalid Post Id");
      }
      const comments = await getPostComments(Number(req.params.postId));

      if (comments) {
        return res.status(200).json({ comments });
      }
      return res.status(201).json("No Comments found");
    } else {
      return res
        .status(500)
        .json("The Page you are looking for does not exist");
    }
  } catch (error) {
    res.status(500).json("Something went wrong, Please try again later");
  }
}
async function fetchUserComments(req, res) {
  try {
    if (req.user) {
      const comments = await getUserComments(req.user);
      if (comments) {
        return res.status(200).json({
          comments,
          isAuthorized: req.user ? true : false,
          userId: req.user ? req.user.id : "",
        });
      }
      return res.status(201).json("No Comments found");
    } else {
      return res.status(401).json("Need to Log in");
    }
  } catch (error) {
    res.status(500).json("Something went wrong, Please try again later");
  }
}

async function creatingComments(req, res) {
  try {
    const result = validationResult(req);
    const post = await getPostById(Number(req.params.postId));
    if (post) {
      if (result.isEmpty()) {
        if (req.user && req.params.postId) {
          if (!req.params.postId || isNaN(req.params.postId)) {
            return res.status(400).json("Invalid Post Id");
          }
          const { comment } = req.body;
          const createdComment = await createComment(
            comment,
            Number(req.params.postId),
            req.user
          );
          return res.status(200).json({ createdComment });
        } else {
          return res.status(401).json("No comments");
        }
      } else {
        return res.status(400).json({
          errors: result.array().map((el) => {
            return el.msg;
          }),
        });
      }
    } else {
      return res.status(201).json("No Post found");
    }
  } catch (error) {
    res.status(500).json("Something went wrong, Please try again later");
  }
}

async function updatingComment(req, res) {
  try {
    const result = validationResult(req);
    if (result.isEmpty()) {
      if (req.params.id) {
        if (!req.params.id || isNaN(req.params.id)) {
          return res.status(400).json("Invalid Comment Id");
        }
        const { comment } = req.body;
        const updatedComment = await updateComment(
          comment,
          Number(req.params.id)
        );
        if (updatedComment !== null) {
          return res.status(200).json({ updatedComment });
        }
        return res.status(201).json("No comment found");
      } else {
        return res
          .status(500)
          .json("The Page you are looking for does not exist");
      }
    } else {
      return res.status(400).json({
        errors: result.array().map((el) => {
          return el.msg;
        }),
      });
    }
  } catch (error) {
    return error;
  }
}
async function deletingComment(req, res) {
  try {
    if (req.params.id) {
      if (!req.params.id || isNaN(req.params.id)) {
        return res.status(400).json("Invalid Comment Id");
      }
      const comment = await deleteComment(Number(req.params.id));
      if (comment) {
        return res.status(200).json({ comment });
      }
      return res.status(201).json("No comment found");
    } else {
      return res
        .status(500)
        .json("The Page you are looking for does not exist");
    }
  } catch (error) {
    res.status(500).json("Something went wrong, Please try again later");
  }
}
module.exports = {
  fetchPostComments,
  fetchUserComments,
  updatingComment,
  creatingComments,
  deletingComment,
};
