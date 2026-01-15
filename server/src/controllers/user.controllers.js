import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { registerSchema } from "../validators/auth.schema.js";
import { registerUser } from "../services/user.services.js";


export const register = asyncHandler(async (req, res) => {
    const validateSchema = registerSchema.parse(req.body);

    const user = await registerUser(validateSchema);

    //generate tokens and save refreshtoken on user
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
})