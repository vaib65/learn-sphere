import { CourseModel } from "../models/course.models.js";
import { EnrollmentModel } from "../models/enrollment.models.js";
import { ApiError } from "../utils/api-error.js";

export const createEnrollInCourseService = async (studentId, courseId) => {
  const course = await CourseModel.findOne({
    _id: courseId,
    status: "published",
  });

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const alreadyEnrolled = await EnrollmentModel.findOne({
    userId: studentId,
    courseId,
  });

  if (alreadyEnrolled) {
    throw new ApiError(409, "student enrollment already exists");
  }

  const enrollment = await EnrollmentModel.create({
    userId: studentId,
    courseId,
    status: "active",
  });

  return enrollment;
};

export const getMyEnrollmentsService = async (studentId) => {
  const enrollments = await EnrollmentModel.find({ userId: studentId });
  return enrollments;
};
