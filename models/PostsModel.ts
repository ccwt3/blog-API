import { prisma } from "../prisma/lib/prisma";

export default {
  createPost,
  getAllMyPosts,
  getOnePost,
  deleteOnePost,
};

async function createPost(id: string, title: string, message: string) {
  try {
    const post = await prisma.post.create({
      data: {
        author_id: id,
        title: title,
        message: message,
      },
    });

    return { status: 201 };
  } catch (err) {
    console.error(err);
    return { status: 500 };
  }
}

async function getAllMyPosts(id: string) {
  try {
    const allPosts = await prisma.post.findMany({
      where: {
        author_id: id,
      },
      orderBy: {
        published_time: "desc",
      },
    });

    return { status: 200, allPosts };
  } catch (err) {
    console.error(err);
    return { status: 500 };
  }
}

async function getOnePost(postId: string, userId: string) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post || post.author_id !== userId) {
      return { status: 404 };
    }

    return { status: 200, post };
  } catch (err) {
    console.error(err);
    return { status: 500 };
  }
}

async function deleteOnePost(postId: string, userId: string) {
  try {
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        author_id: userId,
      },
    });

    if (!post) {
      return { status: 403 };
    }

    await prisma.post.delete({
      where: {
        id: post.id,
      },
    });

    return { status: 200 };
  } catch (err) {
    console.error(err);
    return { status: 500 };
  }
}
