import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
    streakCount: { type: Number, default: 0 },
    lastLoginDate: { type: Date, default: null },
    enrolledCourses:[{type:mongoose.Schema.Types.ObjectId,ref:"Course"}],
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});


userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  const payload = {
    id: this._id,
    email: this.email,
    username: this.username,
  };

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
  });
};

userSchema.methods.generateRefreshToken = function () {
  const payload = { id: this._id };
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  });
};

userSchema.methods.updateStreak = async function (){
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastLogin = this.lastLoginDate ? new Date(this.lastLoginDate) : null;
  if (lastLogin) lastLogin.setHours(0, 0, 0, 0);

  const oneDayinMs = 24 * 60 * 60 * 1000;

  if (!lastLogin) {
    this.streakCount = 1;
  } else {
    const timeDifference = today.getTime() - lastLogin.getTime();
    if (timeDifference === oneDayinMs) {
      this.streakCount += 1;
    } else if (timeDifference > oneDayinMs) {
      this.streakCount = 1;
    }
  }
  this.lastLoginDate = new Date();
  return await this.save();
}

export const UserModel = mongoose.model("User", userSchema);
