import { Router } from "express";
import commentController from "../controllers/commentController";

const router = Router({ mergeParams: true });

router.get("/", commentController.getCommentsForPost);
router.post("/", commentController.createComment);
router.put("/:commentId", commentController.updateComment);
router.delete("/:commentId", commentController.deleteComment);

export default router;
