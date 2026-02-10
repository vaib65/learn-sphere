import { asyncHandler } from "../../utils/async-handler.js";
import { ApiResponse } from "../../utils/api-response.js";
import {
  createCourseService,
  getCourseByIdService,
  getMyCourseService,
  getPublishedCoursesService,
  publishCourseService,
} from "../../services/course.service.js";

{
  /*Create Course handler */
}
export const createCourse = asyncHandler(async (req, res) => {
  const instructorId = req.user._id;

  const { title, category } = req.body;

  const course = await createCourseService(
    {
      title,
      category,
    },
    instructorId,
  );
  return res
    .status(201)
    .json(new ApiResponse(201, course, "Course created successfully"));
});

{
  /*Get Instructor Course handler */
}
export const getMyCourse = asyncHandler(async (req, res) => {
  const instructorId = req.user._id;

  const courses = await getMyCourseService(instructorId);

  return res
    .status(200)
    .json(new ApiResponse(200, courses, "Courses fetched successfully"));

});

{
  /*Update Course handler */
}
export const updateCourse = asyncHandler(async (req, res) => {});

{
  /*Get Published Courses handler */
}
export const publishCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const instructorId = req.user._id;

  const course = await publishCourseService(courseId, instructorId);

  return res
    .status(200)
    .json(new ApiResponse(200, course, "Course published successfully"));
});

{
  /*Get All Published Courses handler */
}
export const getPublishedCourses = asyncHandler(async (req, res) => {
  const courses = await getPublishedCoursesService();

  return res
    .status(200)
    .json(new ApiResponse(200, courses, "Courses fetched successfully"));
});

{
  /*Get courses by id handler */
}
export const getCourseById = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const course = await getCourseByIdService(courseId);

  return res
    .status(200)
    .json(new ApiResponse(200, course, "Courses fetched successfully"));
});
