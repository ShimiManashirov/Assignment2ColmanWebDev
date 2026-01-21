"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const commentController_1 = __importDefault(require("../controllers/commentController"));
const authMiddleware_1 = require("../controllers/authMiddleware");
const router = (0, express_1.Router)({ mergeParams: true });
router.get("/", authMiddleware_1.authenticateToken, commentController_1.default.getCommentsForPost);
router.post("/", authMiddleware_1.authenticateToken, commentController_1.default.createComment);
router.put("/:commentId", authMiddleware_1.authenticateToken, commentController_1.default.updateComment);
router.delete("/:commentId", authMiddleware_1.authenticateToken, commentController_1.default.deleteComment);
exports.default = router;
//# sourceMappingURL=commentRoute.js.map