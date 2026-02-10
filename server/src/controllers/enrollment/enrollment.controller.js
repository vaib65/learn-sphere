import { asyncHandler } from "../../utils/async-handler.js";
import { ApiResponse } from "../../utils/api-response.js";
import { createEnrollInCourseService, getMyEnrollmentsService } from "../../services/enrollment.service.js";

export const EnrollInCourse = asyncHandler(async (req, res) => {
  const studentId = req.user._id;
  const { courseId } = req.params;
  const Enrollment = await createEnrollInCourseService(studentId, courseId);

  res
    .status(201)
    .json(new ApiResponse(201, Enrollment, "Enrolled Successfully"));
});
export const getMyEnrollments = asyncHandler(async (req, res) => {
  const studentId = req.user._id;
  const Enrollments = await getMyEnrollmentsService(studentId);
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        Enrollments,
        "Enrollments fetched successfully",
      ),
    );
});
