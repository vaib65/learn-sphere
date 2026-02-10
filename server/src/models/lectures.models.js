import mongoose, { Schema } from "mongoose";

const lectureSchema = new Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: {
        type: String,
        required:true
    },
    contentUrl: {
        type: String,
        required:true
    },
    cloudinaryPublicId: {
        type: String,
        required:true
    },
    contentType: {
      type: String,
        enum: ["pdf", "video"],
      required:true
    },
    order: {
        type: Number,
        required:true
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

lectureSchema.index({courseId: 1,order:1 }, { unique: true });

export const LectureModel = mongoose.model("Lecture", lectureSchema);
