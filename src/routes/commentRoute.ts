import { Router } from "express";
import commentController from "../controllers/commentController";
import { authenticateToken } from "../controllers/authMiddleware";

const router = Router({ mergeParams: true });

router.get("/", authenticateToken, commentController.getCommentsForPost);
router.post("/", authenticateToken, commentController.createComment);
router.put("/:commentId", authenticateToken, commentController.updateComment);
router.delete("/:commentId", authenticateToken, commentController.deleteComment);

export default router;
