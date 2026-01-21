import { Request, Response } from "express";
import mongoose from "mongoose";
import Comment from "../models/commentModel";

const getCommentsForPost = async (req: Request, res: Response): Promise<void> => {
  const postId = req.params.postId;
  try {
    const comments = await Comment.find({ post: postId as any });
    res.json(comments);
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: "Error retrieving comments", error: errorMessage });
  }
};

const createComment = async (req: Request, res: Response): Promise<void> => {
  const postId = req.params.postId;
  try {
    const comment = await Comment.create({ ...req.body, post: postId });
    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: "Error creating comment", error: errorMessage });
  }
};

const updateComment = async (req: Request, res: Response): Promise<void> => {
  const commentId = req.params.commentId;
  const updatedData = req.body;
  try {
    const updatedComment = await Comment.findByIdAndUpdate(commentId, updatedData, { new: true });
    res.json(updatedComment);
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: "Error updating comment", error: errorMessage });
  }
};

const deleteComment = async (req: Request, res: Response): Promise<void> => {
  const commentId = req.params.commentId;
  try {
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if (!deletedComment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }
    res.status(204).end();
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: "Error deleting comment", error: errorMessage });
  }
};

export default {
  getCommentsForPost,
  createComment,
  updateComment,
  deleteComment
};
