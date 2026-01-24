"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postModel_1 = __importDefault(require("../models/postModel"));
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.query.userId;
    try {
        if (userId) {
            const posts = yield postModel_1.default.find({ userId });
            res.json(posts);
        }
        else {
            const posts = yield postModel_1.default.find();
            res.json(posts);
        }
    }
    catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ message: "Error retrieving posts", error: errorMessage });
    }
});
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const post = yield postModel_1.default.findById(id);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        res.json(post);
    }
    catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ message: "Error retrieving post", error: errorMessage });
    }
});
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postData = req.body;
    postData.userId = req.user.userId;
    console.log(postData);
    try {
        const newPost = yield postModel_1.default.create(postData);
        res.status(201).json(newPost);
    }
    catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ message: "Error creating post", error: errorMessage });
    }
});
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updateData = req.body;
    try {
        const post = yield postModel_1.default.findById(id);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        if (post.userId !== req.user.userId) {
            res.status(403).json({ message: "You are not authorized to update this post" });
            return;
        }
        const { userId } = updateData, rest = __rest(updateData, ["userId"]); // Exclude userId from update
        const updatedPost = yield postModel_1.default.findByIdAndUpdate(id, rest, { new: true });
        if (!updatedPost) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        res.json(updatedPost);
    }
    catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ message: "Error updating post", error: errorMessage });
    }
});
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const post = yield postModel_1.default.findById(id);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        if (post.userId !== req.user.userId) {
            res.status(403).json({ message: "You are not authorized to delete this post" });
            return;
        }
        yield postModel_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: "Post deleted successfully" });
    }
    catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ message: "Error deleting post", error: errorMessage });
    }
});
exports.default = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
};
//# sourceMappingURL=postController.js.map