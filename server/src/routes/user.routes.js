import { Router } from "express"
import { registerSchema } from "../validators/user.validators.js"
import { registerUser } from "../controllers/user.controllers.js"
import { validate } from "../middlewares/validate.middlares.js"
import { loginSchema } from "../validators/user.validators.js"
import { loginUser } from "../controllers/user.controllers.js"

const userRouter = Router();

userRouter.post("/register", validate(registerSchema), registerUser);

userRouter.post("/login", validate(loginSchema), loginUser);

export default userRouter;