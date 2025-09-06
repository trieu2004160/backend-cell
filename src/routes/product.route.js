const express = require("express");
const {
  createProductController,
  getAllProductController,
  deleteProductController,
  updateProductController,
  getAllNameProductController,
  getProductByIdController,
} = require("../controllers/product.controller");
const routes = express.Router();

routes.get("/", getAllProductController);
routes.get("/name", getAllNameProductController);
routes.get("/detail/:id", getProductByIdController);
routes.post("/", createProductController);
routes.get("/:id", getProductByIdController);
routes.delete("/:id", deleteProductController);
routes.patch("/:id", updateProductController);

module.exports = routes;
