import { asyncHandler } from "../../utils/async-handler.js";
import { ApiResponse } from "../../utils/api-response.js";
import { getMyProgressByCourseService, markLectureCompletedService } from "../../services/progress.service.js";

export const markLectureCompleted = asyncHandler(async (req, res) => {
    const studentId = req.user._id;
    const { lectureId } = req.params;

    const progress = await markLectureCompletedService(lectureId,studentId);
    
    res.status(201).json(new ApiResponse(201,progress,"Lecture marked as completed"))
})

export const getMyProgressByCourse = asyncHandler(async (req, res) => {
    const studentId = req.user._id;
    const { courseId } = req.params;

   const progress = await getMyProgressByCourseService(studentId, courseId);

   res
     .status(200)
     .json(new ApiResponse(200, progress, "Progress fetched successfully"));
});