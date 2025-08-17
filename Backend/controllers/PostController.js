const jwt = require("jsonwebtoken");
require("dotenv").config();
const {
  getAllLikesPosts,
  getAllPosts,
  getPostById,
  getPostsByUser,
  getUnpublishedPosts,
  deletePost,
  likeOrDislikePost,
  updatePostStatus,
  updatePost,
  createPublishPost,
  createUnPublishPost,
} = require("../db/queries");
const { validationResult } = require("express-validator");

async function getUserFromToken(req, res) {
  let isAuthorized = false;
  let user = null;
  const token = req.cookies.jwt;
  if (token) {
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
      isAuthorized = true;
    } catch (err) {
      isAuthorized = false;
    }
  }
  return { isAuthorized, user };
}
async function fetchAllPosts(req, res) {
  try {
    const posts = await getAllPosts();
    const { isAuthorized, user } = await getUserFromToken(req, res);

    return res.status(200).json({
      posts,
      isAuthorized,
      user: user ? { id: user.id } : null,
    });
  } catch (error) {
    res.status(500).json("Something went wrong, Please try again later");
  }
}

async function fetchPost(req, res) {
  try {
    if (req.params.id) {
      if (!req.params.id || isNaN(req.params.id)) {
        return res.status(400).json("Invalid Post Id");
      }
      const post = await getPostById(Number(req.params.id));
      const { isAuthorized, user } = await getUserFromToken(req, res);
      if (post) {
        return res.status(200).json({
          post,
          isAuthorized,
          user: user ? { id: user.id } : null,
        });
      }
      return res.status(201).json("No Post found");
    } else {
      return res
        .status(500)
        .json("The Page you are looking for does not exist");
    }
  } catch (error) {
    res.status(500).json("Something went wrong, Please try again later");
  }
}
async function fetchAllPostsForUser(req, res) {
  try {
    if (req.user) {
      const posts = await getPostsByUser(Number(req.user.id));
      const { isAuthorized } = await getUserFromToken(req, res);
      return res.status(200).json({ posts, isAuthorized });
    } else {
      return res.status(401).json("Need log in");
    }
  } catch (error) {
    res.status(500).json("Something went wrong, Please try again later");
  }
}
async function fetchAllUnpublishedPosts(req, res) {
  try {
    if (req.user) {
      const posts = await getUnpublishedPosts(Number(req.user.id));
      const { isAuthorized } = await getUserFromToken(req, res);
      return res.status(200).json({ posts, isAuthorized });
    } else {
      return res.status(401).json("Need log in");
    }
  } catch (error) {
    res.status(500).json("Something went wrong, Please try again later");
  }
}

async function fetchLikedPosts(req, res) {
  try {
    if (req.user) {
      const posts = await getAllLikesPosts(Number(req.user.id));
      const { isAuthorized } = await getUserFromToken(req, res);
      return res.status(200).json({ posts, isAuthorized });
    } else {
      return res.status(401).json("Need log in");
    }
  } catch (error) {
    res.status(500).json("Something went wrong, Please try again later");
  }
}
async function makePublishPosts(req, res) {
  try {
    const result = validationResult(req);
    if (result.isEmpty()) {
      if (req.user) {
        const { title, content } = req.body;
        const publishedPost = await createPublishPost(title, content, req.user);
        const { isAuthorized } = await getUserFromToken(req, res);

        return res.status(200).json({ publishedPost, isAuthorized });
      } else {
        return res.status(401).json("Need log in");
      }
    } else {
      return res.status(400).json({
        errors: result.array().map((el) => {
          return el.msg;
        }),
      });
    }
  } catch (error) {
    res.status(500).json("Something went wrong, Please try again later");
  }
}
async function makeUnPublishPosts(req, res) {
  try {
    const result = validationResult(req);
    if (result.isEmpty()) {
      if (req.user) {
        const { title, content } = req.body;
        const unpublishedPost = await createUnPublishPost(
          title,
          content,
          req.user
        );
        const { isAuthorized } = await getUserFromToken(req, res);

        return res.status(200).json({ unpublishedPost, isAuthorized });
      } else {
        return res.status(401).json("Need log in");
      }
    } else {
      return res.status(400).json({
        errors: result.array().map((el) => {
          return el.msg;
        }),
      });
    }
  } catch (error) {
    res.status(500).json("Something went wrong, Please try again later");
  }
}

async function toggleLikePost(req, res) {
  try {
    if (req.params.id) {
      if (!req.params.id || isNaN(req.params.id)) {
        return res.status(400).json("Invalid Post Id");
      }
      const post = await likeOrDislikePost(Number(req.params.id), req.user);
      if (post) {
        return res.status(200).json({ post });
      }
      return res.status(201).json("No Post found");
    } else {
      return res
        .status(500)
        .json("The Page you are looking for does not exist");
    }
  } catch (error) {
    res.status(500).json("Something went wrong, Please try again later");
  }
}

async function changingPost(req, res) {
  try {
    if (req.params.id) {
      if (!req.params.id || isNaN(req.params.id)) {
        return res.status(400).json("Invalid Post Id");
      }
      const result = validationResult(req);
      if (result.isEmpty()) {
        const { title, content } = req.body;
        const post = await updatePost(title, content, Number(req.params.id));

        if (post) {
          return res.status(200).json({ post });
        }
        return res.status(201).json("No Post found");
      }
      return res.status(400).json({
        errors: result.array().map((el) => {
          return el.msg;
        }),
      });
    } else {
      return res
        .status(500)
        .json("The Page you are looking for does not exist");
    }
  } catch (error) {
    res.status(500).json("Something went wrong, Please try again later");
  }
}
async function togglePostStatus(req, res) {
  try {
    if (req.params.id) {
      if (!req.params.id || isNaN(req.params.id)) {
        return res.status(400).json("Invalid Post Id");
      }
      const post = await updatePostStatus(Number(req.params.id));

      if (post) {
        return res.status(200).json({ post });
      }
      return res.status(201).json("No Post found");
    } else {
      return res
        .status(500)
        .json("The Page you are looking for does not exist");
    }
  } catch (error) {
    res.status(500).json("Something went wrong, Please try again later");
  }
}

async function deletingPost(req, res) {
  try {
    if (req.params.id) {
      if (!req.params.id || isNaN(req.params.id)) {
        return res.status(400).json("Invalid Post Id");
      }
      const post = await deletePost(Number(req.params.id));

      if (post) {
        return res.status(200).json({ post });
      }
      return res.status(201).json("No Post found");
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
};
