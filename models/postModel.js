const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('post', postSchema);