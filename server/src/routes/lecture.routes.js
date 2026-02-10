import { Router } from "express"
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { authorizeRoles } from "../middlewares/role.middlewares.js";
import { ROLES } from "../constants/role.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { createLecture, getLectureById, getLecturesByCourse, updateLecture } from "../controllers/lecture/lecture.controller.js";


const lectureRouter = Router();

lectureRouter.post(
    "/:courseId",
    authMiddleware,
    authorizeRoles(ROLES.INSTRUCTOR),
    upload.single("file"),
    createLecture
);

lectureRouter.get(
    "/course/:courseId",
    getLecturesByCourse
);

lectureRouter.get(
    "/:lectureId",
    authMiddleware,
    getLectureById
);

lectureRouter.patch(
    "/:lectureId",
    authMiddleware,
    authorizeRoles(ROLES.INSTRUCTOR),
    upload.single("file"),
    updateLecture
);

export default lectureRouter