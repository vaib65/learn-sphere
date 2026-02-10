import { cloudinary } from "../config/cloudinary.config.js";

export const uploadMedia = async (
  fileBuffer,
  folder,
  resourceType = "auto",
) => {
  try {
    return await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      stream.end(fileBuffer);
    });
  } catch (error) {
    throw error;
  }
};

export const deleteMediaFromCloudinary = async (
  publicId,
  resourceType = "auto",
) => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    throw error;
  }
};
