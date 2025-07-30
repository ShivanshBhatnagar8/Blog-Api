const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createUser(firstName, lastName, email, hashedPassword) {
  try {
    const user = await prisma.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        username: email,
        password: hashedPassword,
      },
    });
    return user;
  } catch (error) {
    return error;
  }
}
async function fetchUserByEmail(email) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: email,
      },
    });
    return user;
  } catch (error) {
    return error;
  }
}

async function updatePasswordOfUser(email, password) {
  try {
    const user = await prisma.user.update({
      where: {
        username: email,
      },
      data: {
        password: password,
      },
    });
    return user;
  } catch (error) {
    return error;
  }
}

async function getAllPosts() {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        published: true,
      },
    });
    return posts;
  } catch (error) {
    return error;
  }
}

async function getPostById(postId) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
        published: true,
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            author: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
        likes: true,
        likeBy: true,
        author: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    return post;
  } catch (error) {
    return error;
  }
}
async function getPostsByUser(userId) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
      },
    });
    return posts;
  } catch (error) {
    return error;
  }
}

async function getUnpublishedPosts(userId) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: false,
        authorId: userId,
      },
    });
    return posts;
  } catch (error) {
    return error;
  }
}

async function createPublishPost(postTitle, postContent, user) {
  try {
    const post = await prisma.post.create({
      data: {
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
        title: postTitle,
        content: postContent,
        published: true,
        likes: 0,
        author: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    return post;
  } catch (error) {
    return error;
  }
}
async function createUnPublishPost(postTitle, postContent, user) {
  try {
    const post = await prisma.post.create({
      data: {
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
        title: postTitle,
        content: postContent,
        published: false,
        likes: 0,
        author: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    return post;
  } catch (error) {
    return error;
  }
}
async function updatePostStatus(postId) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });
    if (post) {
      const updatedPost = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          published: !post.published,
        },
      });
      return updatedPost;
    }
  } catch (error) {
    return error;
  }
}
async function updatePost(postTitle, postContent, postId) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });
    if (post) {
      const updatedPost = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          title: postTitle,
          content: postContent,
          updatedAt: new Date(Date.now()),
        },
      });
      return updatedPost;
    }
  } catch (error) {
    return error;
  }
}

async function deletePost(postId) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });
    if (post) {
      const deletedPost = await prisma.post.delete({
        where: {
          id: postId,
        },
      });
      return deletedPost;
    }
  } catch (error) {
    return error;
  }
}

async function likeOrDislikePost(postId, user) {
  try {
    return prisma.$transaction(async (tx) => {
      const post = await tx.$queryRawUnsafe(
        `SELECT * FROM "Post" WHERE id = $1 FOR UPDATE`,
        postId
      );
      if (post[0]) {
        const userId = user.id.toString();
        post[0].likeBy =
          post[0].likeBy === null ? (post[0].likeBy = []) : post[0].likeBy;
        if (!post[0]?.likeBy?.includes(userId)) {
          const updatedPost = await tx.post.update({
            where: { id: postId },
            data: {
              likes: post[0].likes + 1,
              likeBy: {
                set: [...post[0].likeBy, userId],
              },
            },
          });
          return updatedPost;
        } else {
          const updatedLikeBy = post[0].likeBy.filter((id) => id !== userId);
          const disLikePost = await tx.post.update({
            where: { id: postId },
            data: {
              likes: post[0].likes === 0 ? 0 : post[0].likes - 1,
              likeBy: {
                set: updatedLikeBy,
              },
            },
          });
          return disLikePost;
        }
      }
    });
  } catch (error) {
    return error;
  }
}

async function getAllLikesPosts(userId) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        likeBy: {
          has: userId.toString(),
        },
      },
    });
    return posts;
  } catch (error) {
    return error;
  }
}

async function getPostComments(postId) {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId: postId,
      },
    });
    return comments;
  } catch (error) {
    return error;
  }
}
async function getUserComments(user) {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        authorId: user.id,
      },
    });
    return comments;
  } catch (error) {
    return error;
  }
}

async function createComment(content, postId, user) {
  try {
    const comment = await prisma.comment.create({
      data: {
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
        content: content,
        post: {
          connect: {
            id: postId,
          },
        },
        author: {
          connect: {
            id: user.id,
          },
        },
      },
      include: {
        author: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
    });
    return comment;
  } catch (error) {
    return error;
  }
}
async function updateComment(content, commentId) {
  try {
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (comment) {
      const updatedComment = await prisma.comment.update({
        where: {
          id: commentId,
        },
        data: {
          content: content,
          updatedAt: new Date(Date.now()),
        },
      });
      return updatedComment;
    }
    return null;
  } catch (error) {
    return error;
  }
}
async function deleteComment(commentId) {
  try {
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (comment) {
      const deletedComment = await prisma.comment.delete({
        where: {
          id: commentId,
        },
      });
      return deletedComment;
    }
    return null;
  } catch (error) {
    return error;
  }
}
module.exports = {
  createUser,
  fetchUserByEmail,
  updatePasswordOfUser,
  getAllLikesPosts,
  getAllPosts,
  getPostById,
  getPostsByUser,
  getUnpublishedPosts,
  deletePost,
  updatePostStatus,
  updatePost,
  createPublishPost,
  createUnPublishPost,
  likeOrDislikePost,
  getPostComments,
  getUserComments,
  updateComment,
  createComment,
  deleteComment,
};
