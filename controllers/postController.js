const postModel = require('../models/postModel');

const getAllPosts = async (req, res) => {
    try {
        const { sender } = req.query;
        const filter = sender ? { sender } : {};
        const posts = await postModel.find(filter);
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving posts', error: error.message });
    }
};
const getPostById = async(req, res) => {
    const id = req.params.id;
    try {
        const post = await postModel.findById(id);
        if (!post) {
            return res.status(404).json({message: 'Post not found'});
        } else{  
          res.json(post);}

    }catch(error) {
        console.error(error);
        res.status(500).json({message: 'Error retrieving post', error: error.message});
    }};

    const createPost = async(req, res) => {
    const postData = req.body;
    console.log(postData);
    try {
        const newPost = await postModel.create(postData);
        res.status(201).json(newPost);
    }catch(error) {
        console.error(error);
        res.status(500).json({message: 'Error creating post', error: error.message});
    }
};

const updatePost = async(req, res) => {
    const id = req.params.id;
    const updateData = req.body;
    try {
        const updatedPost = await postModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(updatedPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating post', error: error.message });
    }
};

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost

};