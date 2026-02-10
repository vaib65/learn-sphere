import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { authorizeRoles } from "../middlewares/role.middlewares.js";
import { ROLES } from "../constants/role.js";
import { EnrollInCourse, getMyEnrollments } from "../controllers/enrollment/enrollment.controller.js";

const enrollmentRouter = Router();

enrollmentRouter.post("/:courseId", authMiddleware, authorizeRoles(ROLES.STUDENT), EnrollInCourse)

enrollmentRouter.get("/my", authMiddleware, authorizeRoles(ROLES.STUDENT), getMyEnrollments)

export default enrollmentRouter;