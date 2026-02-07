import { ApiError } from "../utils/api-error.js";

export const validate = (schema) => (req, res, next) => {
    try {
        const parsedData = schema.parse(req.body);
        req.body = parsedData; 
        next()
    } catch (error) {
        const errorMessage = error.errors.map((err) => err.message).join(", ")
        throw new ApiError(400, errorMessage);
    }
}