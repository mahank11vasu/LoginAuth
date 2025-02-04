import express from "express";
import { registerUser, loginUser, logoutUser, getUsers, updateUser, getUserSession } from "../controllers/userController.js";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", upload.single("image"), registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/users", protect, getUsers);
router.put("/users/:id", protect, upload.single("image"), updateUser); 
router.get("/session", getUserSession);


export default router;
