const { errorResponse, successResponse } = require("../utils/response.util");

const uploadController = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return errorResponse(res, "No file uploaded", 400);
    }

    // Check if Cloudinary credentials are configured
    if (
      !process.env.CLOUD_NAME ||
      !process.env.API_KEY ||
      !process.env.API_SECRET ||
      process.env.API_SECRET === "YOUR_CLOUDINARY_API_SECRET_HERE"
    ) {
      return errorResponse(
        res,
        "Cloudinary credentials not properly configured",
        500
      );
    }

    successResponse(
      res,
      "Upload image successfully!",
      {
        url: req.file.path,
        public_id: req.file.filename,
        original_name: req.file.originalname,
        size: req.file.size,
      },
      200
    );
  } catch (error) {
    console.error("Upload error:", error);
    errorResponse(res, error.message || "Upload failed", 500);
  }
};

module.exports = {
  uploadController,
};
