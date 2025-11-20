const CartItem = require("../models/cart_item.model");

const cartItemController = {
  // Get all cart items
  getAll: async (req, res) => {
    try {
      const cartItems = await CartItem.findAll();
      res.status(200).json({
        status: "success",
        message: "Cart items retrieved successfully",
        data: cartItems,
      });
    } catch (error) {
      console.error("Error getting cart items:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to get cart items",
        error: error.message,
      });
    }
  },

  // Get cart items by user ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const cartItems = await CartItem.findAll({
        where: { user_id: id },
      });
      
      res.status(200).json({
        status: "success",
        message: "Cart items retrieved successfully",
        data: cartItems,
      });
    } catch (error) {
      console.error("Error getting cart items:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to get cart items",
        error: error.message,
      });
    }
  },

  // Create cart item
  create: async (req, res) => {
    try {
      const { user_id, product_id, variant_id, quantity } = req.body;

      // Check if item already exists
      const existingItem = await CartItem.findOne({
        where: {
          user_id,
          product_id,
          variant_id,
        },
      });

      if (existingItem) {
        // Update quantity if exists
        existingItem.quantity += quantity || 1;
        await existingItem.save();
        
        return res.status(200).json({
          status: "success",
          message: "Cart item updated successfully",
          data: existingItem,
        });
      }

      // Create new cart item
      const cartItem = await CartItem.create({
        user_id,
        product_id,
        variant_id,
        quantity: quantity || 1,
      });

      res.status(201).json({
        status: "success",
        message: "Cart item created successfully",
        data: cartItem,
      });
    } catch (error) {
      console.error("Error creating cart item:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to create cart item",
        error: error.message,
      });
    }
  },

  // Update cart item
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      const cartItem = await CartItem.findByPk(id);
      
      if (!cartItem) {
        return res.status(404).json({
          status: "error",
          message: "Cart item not found",
        });
      }

      if (quantity !== undefined) {
        cartItem.quantity = quantity;
      }

      await cartItem.save();

      res.status(200).json({
        status: "success",
        message: "Cart item updated successfully",
        data: cartItem,
      });
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to update cart item",
        error: error.message,
      });
    }
  },

  // Delete cart item
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const cartItem = await CartItem.findByPk(id);
      
      if (!cartItem) {
        return res.status(404).json({
          status: "error",
          message: "Cart item not found",
        });
      }

      await cartItem.destroy();

      res.status(200).json({
        status: "success",
        message: "Cart item deleted successfully",
        data: cartItem,
      });
    } catch (error) {
      console.error("Error deleting cart item:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to delete cart item",
        error: error.message,
      });
    }
  },
};

module.exports = cartItemController;
