const commentmodel = require('../models/commentModel');


const getCommentsForPost = async (req, res) => {
    const postId = req.params.postId;
    try {
        const comments = await commentmodel.find({ post: postId });
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving comments', error: error.message });
    }
};

const createComment = async (req, res) => {
    const postId = req.params.postId;
    try {
        const comment = await commentmodel.create({ ...req.body, post: postId });
        res.status(201).json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating comment', error: error.message });
    }
};

const updateComment = async (req, res) => { 
    const commentId = req.params.commentId;
    const updatedData = req.body;
    try {
        const updatedComment = await commentmodel.findByIdAndUpdate(commentId, updatedData, { new: true });
        res.json(updatedComment);
    }      catch (error) { 
        console.error(error);
        res.status(500).json({ message: 'Error updating comment', error: error.message });
    }
};

const deleteComment = async (req, res) => { 
    const commentId = req.params.commentId;
    try {
        const deletedComment = await commentmodel.findByIdAndDelete(commentId);
        if (!deletedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting comment', error: error.message });
    }
}

module.exports = {
    getCommentsForPost,
    createComment,
    updateComment,
    deleteComment
};