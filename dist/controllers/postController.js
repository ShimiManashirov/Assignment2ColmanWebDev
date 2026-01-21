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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postModel_1 = __importDefault(require("../models/postModel"));
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sender } = req.query;
        const filter = sender ? { sender } : {};
        const posts = yield postModel_1.default.find(filter);
        res.json(posts);
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
        const updatedPost = yield postModel_1.default.findByIdAndUpdate(id, updateData, { new: true });
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
exports.default = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost
};
//# sourceMappingURL=postController.js.map