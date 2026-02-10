import { asyncHandler } from "../../utils/async-handler.js";
import { ApiResponse } from "../../utils/api-response.js";
import {
  createLectureService,
  getLectureByIdService,
  getLecturesByCourseService,
  updateLectureService,
} from "../../services/lectures.service.js";


{/*instructor create course */}
export const createLecture = asyncHandler(async (req, res) => {
  const instructorId = req.user._id;
  const { courseId } = req.params;
  const { title, contentType, order, isPreview } = req.body;
  const file = req.file;

  const lecture = await createLectureService({
    instructorId,
    courseId,
    title,
    contentType,
    order,
    isPreview,
    file,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, lecture, "Lecture created successfully"));
});

{/*shows lecture list of course page  */}
export const getLecturesByCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const user = req.user || null;

  const lectures = await getLecturesByCourseService(courseId, user);

  return res
    .status(200)
    .json(new ApiResponse(200, lectures, "Lectures fetched successfully"));
});

{
  /*Open a lecture player page*/
}
export const getLectureById = asyncHandler(async (req, res) => {
  const { lectureId } = req.params;
  const user = req.user;

  const lecture = await getLectureByIdService(lectureId, user);

  return res
    .status(200)
    .json(new ApiResponse(200, lecture, "Lecture fetched successfully"));
});

{
  /*Instructor edit lectures or replace  */
}
export const updateLecture = asyncHandler(async (req, res) => {
  const { lectureId } = req.params;
  const instructorId = req.user._id;
  const updateData = req.body;
  const file = req.file;

  const lecture = await updateLectureService({
    lectureId,
    instructorId,
    updateData,
    file,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, lecture, "Lecture updated successfully"));
});
