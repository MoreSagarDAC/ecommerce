import express from "express";
import {
  registerUser,
  verifyOTP,
  userExistingLogin,
  userLogout,
} from "../../controller/users/user.js";
import { forgotPassword, resetPassword } from "../../controller/users/passwordController.js"
import authMiddleware from "../../middlewares/auth.js";
const UserRouter = express.Router();

UserRouter.post("/register", registerUser);
UserRouter.post("/login", userExistingLogin);
UserRouter.post("/logout", authMiddleware, userLogout);
UserRouter.post("/verify-otp", verifyOTP);
UserRouter.post("/forgot-password", forgotPassword);
UserRouter.post("/reset-password", resetPassword);

export default UserRouter;
