const express = require("express");
const routes = express.Router();

console.log("Loading routes...");

const authRoute = require("./auth.route");
const categoryRoute = require("./category.route");
const brandRoute = require("./brand.route");
const productRoute = require("./product.route");
const uploadRoute = require("./upload.route");
const product_imageRoute = require("./product_image.route");
const menuRoute = require("./menu.route");
const testRoute = require("./test.route");
const productVariantRoute = require("./product_variant.route");
const cartItemRoute = require("./cart_item.route");
const variantRoute = require("./variant.route");

console.log("Loading admin routes...");
const adminVariantRoute = require("./admin.variants.simple.routes");
console.log("Admin variant simple route loaded");

const uploadApiRoute = require("./upload.routes");
console.log("Upload API route loaded");

const adminProductImagesRoute = require("./admin.product.images.routes");
console.log("Admin product images route loaded");

console.log("Registering routes...");
routes.use("/auth", authRoute);
routes.use("/category", categoryRoute);
routes.use("/brand", brandRoute);
routes.use("/upload", uploadRoute);

// Admin routes - mount TRƯỚC để có priority cao hơn
routes.use("/admin/variants", adminVariantRoute);
routes.use("/admin/product-images", adminProductImagesRoute);

// Public routes
routes.use("/products", productRoute);
routes.use("/product-images", product_imageRoute);
routes.use("/menu", menuRoute);
routes.use("/test", testRoute);
routes.use("/product-variants", productVariantRoute);
routes.use("/cart-items", cartItemRoute);

// Generic routes - mount CUỐI CÙNG
routes.use("/", variantRoute); // Variant management: /products/:id/variants, /variants/:id
routes.use("/", uploadApiRoute);

console.log("All routes registered");

module.exports = routes;
