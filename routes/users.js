import express from "express";
import {
  signin,
  signup,
  getUser,
  getUsers,
  deleteUser,
  blockUser,
  unlockUser,
  addToAdmin,
  rmFromAdmin,
} from "../controllers/user.js";
const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);

router.get("/", getUsers);
router.get("/:id", getUser);
router.delete("/:id", deleteUser);
router.patch("/block/:id", blockUser);
router.patch("/unlock/:id", unlockUser);
router.patch("/addAdmin/:id", addToAdmin);
router.patch("/rmAdmin/:id", rmFromAdmin);

export default router;
