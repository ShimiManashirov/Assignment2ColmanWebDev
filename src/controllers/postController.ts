import { Request, Response } from "express";
import Post from "../models/postModel";

const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sender } = req.query;
    const filter = sender ? { sender } : {};
    const posts = await Post.find(filter);
    res.json(posts);
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
    const updatedPost = await Post.findByIdAndUpdate(id, updateData, { new: true });
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

export default {
  getAllPosts,
  getPostById,
  createPost,
  updatePost
};
