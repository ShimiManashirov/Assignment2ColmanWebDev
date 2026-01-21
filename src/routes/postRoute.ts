import { Router } from "express";
import postController from "../controllers/postController";
import { authenticateToken } from "../controllers/authMiddleware";

const router = Router();

router.get("/", authenticateToken, postController.getAllPosts);
router.get("/:id", authenticateToken, postController.getPostById);
router.post("/", authenticateToken, postController.createPost);
router.put("/:id", authenticateToken, postController.updatePost);
router.delete("/:id", authenticateToken, postController.deletePost);

export default router;
