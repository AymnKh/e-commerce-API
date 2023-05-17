import express from "express";
import { getUserList, login, register, updateUser } from "../controllers/user.js";

const router = express.Router();

router.post("/register", register); //register user
router.post("/login", login); //login user
router.put("/users/:id", updateUser); //update user
router.get('/users', getUserList); //get all users
export default router;