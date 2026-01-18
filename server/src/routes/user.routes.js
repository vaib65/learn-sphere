import { Router } from "express";
import { registerSchema, loginSchema } from "../validators/user.validators.js";
import {
  logoutUser,
  registerUser,
  loginUser,
  getCurrentUser,
  refreshAccessToken,
} from "../controllers/user.controllers.js";
import { validate } from "../middlewares/validate.middlwares.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const userRouter = Router();

userRouter.post("/register", validate(registerSchema), registerUser);
userRouter.post("/login", validate(loginSchema), loginUser);
userRouter.get("/me", authMiddleware, getCurrentUser);

userRouter.post("/refresh", refreshAccessToken);
userRouter.post("/logout", authMiddleware, logoutUser);

export default userRouter;
