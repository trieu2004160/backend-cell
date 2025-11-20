const express = require("express");
const router = express.Router();
const cartItemController = require("../controllers/cart_item.controller");

// Cart item routes
router.get("/", cartItemController.getAll);
router.get("/:id", cartItemController.getById);
router.post("/", cartItemController.create);
router.patch("/:id", cartItemController.update);
router.delete("/:id", cartItemController.delete);

module.exports = router;
