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
const commentModel_1 = __importDefault(require("../models/commentModel"));
const getCommentsForPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    try {
        const comments = yield commentModel_1.default.find({ post: postId });
        res.json(comments);
    }
    catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ message: "Error retrieving comments", error: errorMessage });
    }
});
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    try {
        const comment = yield commentModel_1.default.create(Object.assign(Object.assign({}, req.body), { post: postId }));
        res.status(201).json(comment);
    }
    catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ message: "Error creating comment", error: errorMessage });
    }
});
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.commentId;
    const updatedData = req.body;
    try {
        const updatedComment = yield commentModel_1.default.findByIdAndUpdate(commentId, updatedData, { new: true });
        res.json(updatedComment);
    }
    catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ message: "Error updating comment", error: errorMessage });
    }
});
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.commentId;
    try {
        const deletedComment = yield commentModel_1.default.findByIdAndDelete(commentId);
        if (!deletedComment) {
            res.status(404).json({ message: "Comment not found" });
            return;
        }
        res.status(204).end();
    }
    catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ message: "Error deleting comment", error: errorMessage });
    }
});
exports.default = {
    getCommentsForPost,
    createComment,
    updateComment,
    deleteComment
};
//# sourceMappingURL=commentController.js.map