import mongoose, { Schema } from "mongoose";

const enrollmentSchema = new Schema(
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

    status: {
      type: String,
      enum: ["active", "completed", "revoked"], 
      default: "active",
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const EnrollmentModel = mongoose.model("Enrollment", enrollmentSchema);
