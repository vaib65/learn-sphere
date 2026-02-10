import { CourseModel } from "../models/course.models.js";
import { LectureModel } from "../models/lectures.models.js";
import { EnrollmentModel } from "../models/enrollment.models.js";
import { uploadMedia } from "../lib/cloudinary.lib.js";
import { deleteMediaFromCloudinary } from "../lib/cloudinary.lib.js";
import { ApiError } from "../utils/api-error.js";

export const createLectureService = async ({
  instructorId,
  courseId,
  title,
  contentType,
  order,
  isPreview,
  file,
}) => {
  if (!file) {
    throw new ApiError(400, "Lecture content file is required");
  }

  const course = await CourseModel.findOne({ _id: courseId, instructorId });

  if (!course) {
    throw new ApiError(404, "Course not found or not owned by instructor");
  }

  //order conflict check
  const existingLecture = await LectureModel.findOne({ courseId, order });
  if (existingLecture) {
    throw new ApiError(409, "Lecture order already exists");
  }

  //upload to cloudinary
  const uploadResult = await uploadMedia(
    file.buffer,
    "learnsphere/lectures",
    contentType === "video" ? "video" : "raw",
  );

  //create lecture
  const lecture = await LectureModel.create({
    courseId,
    title,
    contentUrl: uploadResult.secure_url,
    cloudinaryPublicId: uploadResult.public_id,
    contentType,
    order,
    isPreview,
  });
  return lecture;
};

export const getLecturesByCourseService = async (courseId, user) => {
  const course = await CourseModel.findById(courseId);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  let hasFullAccess = false;

  if (user) {
    // instructor owns course → full access (draft and published)
    if (course.instructorId.toString() === user._id.toString()) {
      hasFullAccess = true;
    }

    // student enrolled → full access (published only)
    if (user.role === "student" && course.status === "published") {
      const enrolled = await EnrollmentModel.findOne({
        userId: user._id,
        courseId,
        status:"active"
      });

      if (enrolled) {
        hasFullAccess = true;
      }
    }
  }

  // block non-owners from draft courses
  if (course.status !== "published" && !hasFullAccess) {
    throw new ApiError(404, "Course not found");
  }

  const filter = hasFullAccess ? { courseId } : { courseId, isPreview: true };

  const lectures = await LectureModel.find(filter).sort({ order: 1 });

  return lectures;
};


export const getLectureByIdService = async (lectureId, user) => {
  const lecture = await LectureModel.findById(lectureId);
  if (!lecture) {
    throw new ApiError(404, "Lecture not found");
  }

  const course = await CourseModel.findById(lecture.courseId);
  if (!course) {
    throw new ApiError(404, "Lecture not found");
  }

  // Instructor owner → always allowed (even draft)
  if (user && course.instructorId.toString() === user._id.toString()) {
    return lecture;
  }

  // Non-owners cannot access draft courses
  if (course.status !== "published") {
    throw new ApiError(404, "Lecture not found");
  }

  // Student enrolled
  if (user?.role === "student") {
    const enrolled = await EnrollmentModel.findOne({
      userId: user._id,
      courseId: course._id,
      status:"active"
    });

    if (enrolled) {
      return lecture;
    }
  }

  // Preview access
  if (lecture.isPreview) {
    return lecture;
  }

  throw new ApiError(404, "Lecture not found");
};


export const updateLectureService = async ({
  lectureId,
  instructorId,
  updateData,
  file,
}) => {
  const lecture = await LectureModel.findById(lectureId);
  if (!lecture) {
    throw new ApiError(404, "Lecture not found");
  }

  const course = await CourseModel.findOne({
    _id: lecture.courseId,
    instructorId,
  });
  if (!course) {
    throw new ApiError(403, "You do not own this course");
  }

  // order conflict (exclude current lecture)
  if (updateData.order && updateData.order !== lecture.order) {
    const orderExists = await LectureModel.findOne({
      courseId: lecture.courseId,
      order: updateData.order,
      _id: { $ne: lecture._id },
    });

    if (orderExists) {
      throw new ApiError(409, "Lecture order already exists");
    }
  }

  // Replace content if new file provided
  if (file) {
    await deleteMediaFromCloudinary(
      lecture.cloudinaryPublicId,
      lecture.contentType === "video" ? "video" : "raw",
    );

    const uploadResult = await uploadMedia(
      file.buffer,
      "learnsphere/lectures",
      lecture.contentType === "video" ? "video" : "raw",
    );

    lecture.contentUrl = uploadResult.secure_url;
    lecture.cloudinaryPublicId = uploadResult.public_id;
  }

  Object.assign(lecture, updateData);
  await lecture.save();

  return lecture;
};
