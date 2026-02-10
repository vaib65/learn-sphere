import { Router } from "express";
import { validate } from "../middlewares/validate.middlwares.js";
import {
  createCourse,
  getCourseById,
  getMyCourse,
  getPublishedCourses,
  publishCourse,
 
} from "../controllers/course/courses.controller.js";
import { courseInputSchema } from "../controllers/course/course.schema";
import { authorizeRoles } from "../middlewares/role.middlewares.js";
import { ROLES } from "../constants/role.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const courseRouter = Router();

courseRouter.post(
  "/",
  authMiddleware,
  authorizeRoles(ROLES.INSTRUCTOR),
  validate(courseInputSchema),
  createCourse,
);

courseRouter.patch(
  "/:courseId/publish",
  authMiddleware,
  authorizeRoles(ROLES.INSTRUCTOR),
  publishCourse,
);

courseRouter.get("/my",authMiddleware,authorizeRoles(ROLES.INSTRUCTOR),getMyCourse)
courseRouter.get("/",getPublishedCourses)
courseRouter.get("/:courseId",getCourseById)

export default courseRouter;
