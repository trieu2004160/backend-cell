const {
  createProductService,
  getAllProductService,
  deleteProductService,
  updateProductService,
  getAllNameProductService,
} = require("../services/product.service");
const { successResponse, errorResponse } = require("../utils/response.util");

const createProductController = async (req, res) => {
  try {
    const product = await createProductService(req.body);
    successResponse(res, "Create product successfully!", product, 200);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getAllProductController = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category_id,
      brand_id,
      all,
    } = req.query;
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      category_id,
      brand_id,
      all: all === "true",
    };

    const result = await getAllProductService(options);

    if (result.all) {
      res.status(200).json({
        status: "success",
        message: `Get all ${result.total} products successfully!`,
        data: result.data,
        total: result.total,
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "Get all product successfully!",
        data: result.data,
        pagination: result.pagination,
      });
    }
  } catch (error) {
    errorResponse(res, error);
  }
};

const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteProductService(id);
    successResponse(res, "Delete product successfully!", "", 200);
  } catch (error) {
    errorResponse(res, error);
  }
};

const updateProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const paload = req.body;
    const product = await updateProductService(id, paload);
    successResponse(res, "Update product successfully!", product, 200);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getAllNameProductController = async (req, res) => {
  try {
    const allNameProduct = await getAllNameProductService();
    successResponse(
      res,
      "Get all name product successfully!",
      allNameProduct,
      200
    );
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  createProductController,
  getAllProductController,
  deleteProductController,
  updateProductController,
  getAllNameProductController,
};
