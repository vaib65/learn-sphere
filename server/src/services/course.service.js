import { CourseModel } from "../models/course.models.js";
import { ApiError } from "../utils/api-error.js";

export const createCourseService = async (
  { title, category },
  instructorId,
) => {
  const course = await CourseModel.create({
    title,
    instructorId,
    category,
    status: "draft",
  });

  return course;
};


export const publishCourseService = async (courseId, instructorId) => {
    const course = await CourseModel.findById(courseId);

    if (!course) {
        throw new ApiError(404,"Course not found ")
    }

    if (course.instructorId.toString() !== instructorId.toString()) {
        throw new ApiError(403,"You do not own this course")
    }

    if (course.status === 'published') {
        throw new ApiError(409,"Course already published")
    }

    course.status = 'published';
    await course.save();
    
    return course;
}

export const getPublishedCoursesService = async () => {
    const  courses  = await CourseModel.find({ status: 'published' });
    return courses
}

export const getCourseByIdService = async (courseId) => {
    const course = await CourseModel.findOne({ _id:courseId,status: 'published' });

    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    return course
}

export const getMyCourseService = async (instructorId) => {
    const courses = await CourseModel.find({instructorId});
    return courses;
}