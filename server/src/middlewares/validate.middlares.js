import { ApiError } from "../utils/api-error.js";

export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body)
        next()
    } catch (error) {
        const errorMessage = error.errors.map((err) => err.message).join(", ")
        throw new ApiError(400, errorMessage);
    }
}