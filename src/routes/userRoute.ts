import { Router } from "express";
import { getAllUsers, getUserById, updateUser, deleteUser } from "../controllers/userController";
import { authenticateToken } from "../controllers/authMiddleware";

const router = Router();

router.get("/", authenticateToken, getAllUsers);
router.get("/:id", authenticateToken, getUserById);
router.put("/:id", authenticateToken, updateUser);
router.delete("/:id", authenticateToken, deleteUser);

export default router;
