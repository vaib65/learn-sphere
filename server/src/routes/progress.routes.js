import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { authorizeRoles } from "../middlewares/role.middlewares.js";
import { ROLES } from "../constants/role.js";
import { getMyProgressByCourse, markLectureCompleted } from "../controllers/progress/progress.controller.js";


const progressRouter = Router();

progressRouter.post(
    "/lecture/:lectureId",
    authMiddleware,
    authorizeRoles(ROLES.STUDENT),
    markLectureCompleted
);

progressRouter.get(
  "/course/:courseId",
  authMiddleware,
  authorizeRoles(ROLES.STUDENT),
  getMyProgressByCourse,
);

export default progressRouter;