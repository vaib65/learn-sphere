import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { UserModel } from "../models/user.models.js";

{
  /*helper function for generating access and refresh token */
}
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await UserModel.findById(userId)
        if (!user) {
            throw new ApiError(404,"User not found")
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        
        return { accessToken, refreshToken };
    } catch (error) {
        console.error("generateAccessAndRefreshToken error:", error);
        throw new ApiError(
          500,
          "Something went wrong while generating access token"
        );
    }
}

{
  /*user register controller */
}
export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const existedUser = await UserModel.findOne({ email });

  if (existedUser) {
    throw new ApiError(409, "User with email already exists");
  }

  const user = await UserModel.create({
    username,
    email,
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

  // //generate tokens and save refreshtoken on user
  // const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
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
    //    maxAge: parseExpiryToMs(process.env.ACCESS_TOKEN_EXPIRY || "15m"),
  };
  const cookieOptionsRefresh = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "None" : "Lax",
    //    maxAge: parseExpiryToMs(process.env.REFRESH_TOKEN_EXPIRY || "7d"),
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
