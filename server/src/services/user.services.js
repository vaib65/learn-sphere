
import { UserModel } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";

export const registerUser = async (data) => {
    const existingUser = await UserModel.findOne({ email: data.email })
    
    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    const user = await UserModel.create({
        ...data
    })

    return user;
}