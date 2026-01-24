import { Request, Response } from "express";
import Post from "../models/postModel";


const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  const userId = req.query.userId;
  try {
    if (userId) {
      const posts = await Post.find({ userId: userId } as any);
      res.json(posts);
    } else {
      const posts = await Post.find();
      res.json(posts);
    }
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: "Error retrieving posts", error: errorMessage });
  }
};

const getPostById = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  try {
    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    res.json(post);
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: "Error retrieving post", error: errorMessage });
  }
};

const createPost = async (req: Request, res: Response): Promise<void> => {
  const postData = req.body;
  postData.userId = (req as any).user.userId;
  console.log(postData);
  try {
    const newPost = await Post.create(postData);
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: "Error creating post", error: errorMessage });
  }
};

const updatePost = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  const updateData = req.body;
  try {
    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    if (post.userId.toString() !== (req as any).user.userId) {
      res.status(403).json({ message: "You are not authorized to update this post" });
      return;
    }
    const { userId, ...rest } = updateData; // Exclude userId from update
    const updatedPost = await Post.findByIdAndUpdate(id, rest, { new: true });
    if (!updatedPost) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: "Error updating post", error: errorMessage });
  }
};

const deletePost = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  try {
    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    if (post.userId.toString() !== (req as any).user.userId) {
      res.status(403).json({ message: "You are not authorized to delete this post" });
      return;
    }
    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: "Error deleting post", error: errorMessage });
  }
};

export default {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};
