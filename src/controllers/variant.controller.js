const {
  createVariantService,
  getVariantsByProductIdService,
  getVariantByIdService,
  updateVariantService,
  deleteVariantService,
  setDefaultVariantService,
} = require("../services/variant.service");
const { successResponse, errorResponse } = require("../utils/response.util");

const createVariantController = async (req, res) => {
  try {
    const { productId } = req.params;
    console.log("=== CREATE VARIANT ===");
    console.log("Product ID:", productId);
    console.log("Body:", JSON.stringify(req.body, null, 2));
    const variant = await createVariantService(productId, req.body);
    successResponse(res, "Variant created successfully!", variant, 201);
  } catch (error) {
    console.error("Create variant error:", error.message);
    console.error("Error stack:", error.stack);
    errorResponse(res, error);
  }
};

const getVariantsByProductIdController = async (req, res) => {
  try {
    const { productId } = req.params;
    const variants = await getVariantsByProductIdService(productId);
    successResponse(res, "Variants retrieved successfully!", variants, 200);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getVariantByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const variant = await getVariantByIdService(id);
    successResponse(res, "Variant retrieved successfully!", variant, 200);
  } catch (error) {
    errorResponse(res, error);
  }
};

const updateVariantController = async (req, res) => {
  try {
    const { id } = req.params;
    const variant = await updateVariantService(id, req.body);
    successResponse(res, "Variant updated successfully!", variant, 200);
  } catch (error) {
    errorResponse(res, error);
  }
};

const deleteVariantController = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteVariantService(id);
    successResponse(res, "Variant deleted successfully!", null, 200);
  } catch (error) {
    errorResponse(res, error);
  }
};

const setDefaultVariantController = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId } = req.body;
    const variant = await setDefaultVariantService(productId, id);
    successResponse(res, "Default variant set successfully!", variant, 200);
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  createVariantController,
  getVariantsByProductIdController,
  getVariantByIdController,
  updateVariantController,
  deleteVariantController,
  setDefaultVariantController,
};
