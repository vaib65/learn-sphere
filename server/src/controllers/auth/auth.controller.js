import { asyncHandler } from "../../utils/async-handler.js";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";
import { UserModel } from "../../models/user.models.js";
import jwt from "jsonwebtoken"
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshTokenFromCookie = req.cookies?.refreshToken;

  if (!refreshTokenFromCookie) {
    throw new ApiError(401, "refresh token missing");
  }

  let decoded;
  try {
    decoded = jwt.verify(
      refreshTokenFromCookie,
      process.env.REFRESH_TOKEN_SECRET
    );
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new ApiError(401, "Refresh token expired");
    }
    throw new ApiError(401, "Invalid refresh token");
  }

  const user = await UserModel.findById(decoded.id).select("+refreshToken");
  if (!user || !user.refreshToken)
    throw new ApiError(404, "User not autheticated");

  if (user.refreshToken !== refreshTokenFromCookie) {
    user.refreshToken = undefined;
    await user.save({ validateBeforeSave: false });

    throw new ApiError(401, "Refresh token reuse detected. Login again.");
  }

  const newAccessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();

  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  const isProd = process.env.NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "None" : "Lax",
  };

  return res
    .status(201)
    .cookie("accessToken", newAccessToken, cookieOptions)
    .cookie("refreshToken", newRefreshToken, cookieOptions)
    .json(new ApiResponse(200, null, "Access token refreshed successfully"));
});

{
  /*helper function for generating access and refresh token */
}
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("generateAccessAndRefreshToken error:", error);
    throw new ApiError(
      500,
      "Something went wrong while generating access token"
    );
  }
};

{
  /*user register controller */
}
export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const normalizedEmail = email.toLowerCase().trim();

  const existedUser = await UserModel.findOne({ email: normalizedEmail });

  if (existedUser) {
    throw new ApiError(409, "User with email already exists");
  }

  const user = await UserModel.create({
    username,
    email:normalizedEmail,
    password,
  });

  const createdUser = await UserModel.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "User registration failed");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

{
  /*user login controller */
}
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(404, "User does not exists");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  await user.updateStreak();

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await UserModel.findById(user._id).select(
    "-password -refreshToken"
  );

  const isProd = process.env.NODE_ENV === "production";
  const cookieOptionsAccess = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "None" : "Lax",
  };
  const cookieOptionsRefresh = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "None" : "Lax",
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptionsAccess)
    .cookie("refreshToken", refreshToken, cookieOptionsRefresh)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser },
        "User logged in successfully"
      )
    );
});

export const getCurrentUser = asyncHandler(async (req, res) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    // req.user is already sanitized by middleware
    return res
      .status(200)
      .json(new ApiResponse(200, { user: req.user }, "User fetched"));
})

export const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  await UserModel.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });

  //clear cookies on Client
  const isProd = process.env.NODE_ENV === "production";
  const clearOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "None" : "Lax",
  };

  return res
    .status(200)
    .clearCookie("accessToken", clearOptions)
    .clearCookie("refreshToken", clearOptions)
    .json(new ApiResponse(200, null, "Logged out successfully"));
});
