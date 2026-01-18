import jwt from "jsonwebtoken"
import { ApiError } from "../utils/api-error.js"
import { UserModel } from "../models/user.models.js"
import { asyncHandler } from "../utils/async-handler.js"

export const authMiddleware = asyncHandler(async (req, res, next) => {
   
     const authHeader = req.headers.authorization || "";
     const tokenFromHeader = authHeader.startsWith("Bearer ")
       ? authHeader.split(" ")[1]
       : null;
     const tokenFromCookie = req.cookies?.accessToken;

     const token = tokenFromHeader || tokenFromCookie;

     if (!token) {
       throw new ApiError(401, "Unauthorized: access token missing");
     }

     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

     const user = await UserModel.findById(decodedToken?.id).select(
       "-password -refreshToken"
     );

     if (!user) {
       return next(new ApiError(401, "Unauthorized: user not found"));
     }

     req.user = user;
     next();
})