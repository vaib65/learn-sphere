import { CourseModel } from "../models/course.models.js";
import { EnrollmentModel } from "../models/enrollment.models.js";
import { LectureModel } from "../models/lectures.models.js";
import { ProgressModel } from "../models/progress.models.js";
import { ApiError } from "../utils/api-error.js";

export const markLectureCompletedService = async (lectureId, studentId) => {
  const lecture = await LectureModel.findById(lectureId);
  if (!lecture) {
    throw new ApiError(404, "Lecture not found");
  }

  const course = await CourseModel.findById(lecture.courseId);
  if (!course) {
    throw new ApiError(404, "Lecture not found");
  }

  if (course.status !== "published") {
    throw new ApiError(404, "Lecture not found");
  }

  const enrolled = await EnrollmentModel.findOne({
    userId: studentId,
    courseId: course._id,
    status: "active",
  });
  if (!enrolled) {
    throw new ApiError(404, "Lecture not found");
  }

  const existingProgress = await ProgressModel.findOne({
    userId: studentId,
    lectureId,
  });

  if (existingProgress) {
    return existingProgress;
  }

  const progress = await ProgressModel.create({
    userId: studentId,
    courseId: lecture.courseId,
    lectureId,
  });

  return progress;
};

export const getMyProgressByCourseService = async (studentId, courseId) => {
  const course = await CourseModel.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const enrolled = await EnrollmentModel.findOne({
    userId: studentId,
    courseId,
    status: "active",
  });

  if (!enrolled) {
    throw new ApiError(404, "Course not found");
    }
    
    const progress = await ProgressModel.find({ userId: studentId, courseId });

    return progress;
};
