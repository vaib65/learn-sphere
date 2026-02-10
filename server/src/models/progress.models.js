import mongoose, { Schema } from "mongoose";

const progressSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    lectureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
      required: true,
    },
  },
  { timestamps: true },
);

progressSchema.index({ userId: 1, lectureId: 1 }, { unique: true });

export const ProgressModel = mongoose.model("Progress", progressSchema);
