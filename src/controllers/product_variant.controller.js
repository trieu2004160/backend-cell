const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = require("../configs/database.config");

const productVariantController = {
  // Lấy danh sách capacity cho một group_name
  getCapacityByGroup: async (req, res) => {
    try {
      const { group_name } = req.params;

      const capacities = await sequelize.query(
        `
        SELECT DISTINCT storage as capacity
        FROM product_variants pv
        JOIN products p ON pv.product_id = p.id
        WHERE p.name LIKE '%${group_name}%' 
        AND pv.is_active = true
        ORDER BY capacity
      `,
        {
          type: QueryTypes.SELECT,
        }
      );

      res.json({
        status: "success",
        message: `Found ${capacities.length} capacities for ${group_name}`,
        data: capacities,
      });
    } catch (error) {
      console.error("Error getting capacities:", error);
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },

  // Lấy danh sách variant theo capacity và group_name
  getVariantsByCapacityAndGroup: async (req, res) => {
    try {
      const { capacity, group_name } = req.params;

      const variants = await sequelize.query(
        `
        SELECT 
          pv.id,
          pv.color as variant_name,
          pv.storage as capacity,
          pv.sale_price as price,
          pv.image_url,
          pv.stock_quantity
        FROM product_variants pv
        JOIN products p ON pv.product_id = p.id
        WHERE p.name LIKE '%${group_name}%' 
        AND pv.storage = :capacity
        AND pv.is_active = true
        ORDER BY pv.id
      `,
        {
          replacements: { capacity },
          type: QueryTypes.SELECT,
        }
      );

      res.json({
        status: "success",
        message: `Found ${variants.length} variants for ${capacity} ${group_name}`,
        data: variants,
      });
    } catch (error) {
      console.error("Error getting variants:", error);
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },

  // Lấy variant theo ID
  getVariantById: async (req, res) => {
    try {
      const { id } = req.params;

      const variant = await sequelize.query(
        `
        SELECT 
          pv.id,
          pv.color as variant_name,
          pv.storage as capacity,
          pv.sale_price as price,
          pv.image_url,
          pv.stock_quantity,
          p.name as product_name
        FROM product_variants pv
        JOIN products p ON pv.product_id = p.id
        WHERE pv.id = :id
        AND pv.is_active = true
      `,
        {
          replacements: { id },
          type: QueryTypes.SELECT,
        }
      );

      if (variant.length === 0) {
        return res.status(404).json({
          status: "error",
          message: "Variant not found",
        });
      }

      res.json({
        status: "success",
        message: "Variant found",
        data: variant[0],
      });
    } catch (error) {
      console.error("Error getting variant by ID:", error);
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },

  // Lấy tất cả variants cho một sản phẩm
  getVariantsByProductId: async (req, res) => {
    try {
      const { productId } = req.params;

      const variants = await sequelize.query(
        `
        SELECT 
          pv.id,
          pv.color as variant_name,
          pv.storage as capacity,
          pv.sale_price as price,
          pv.image_url,
          pv.stock_quantity
        FROM product_variants pv
        WHERE pv.product_id = :productId
        AND pv.is_active = true
        ORDER BY pv.storage, pv.id
      `,
        {
          replacements: { productId },
          type: QueryTypes.SELECT,
        }
      );

      res.json({
        status: "success",
        message: `Found ${variants.length} variants`,
        data: variants,
      });
    } catch (error) {
      console.error("Error getting variants by product ID:", error);
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },

  // Lấy nhiều variants theo danh sách IDs
  getVariantsByIds: async (req, res) => {
    try {
      const { ids } = req.query;

      if (!ids) {
        return res.status(400).json({
          status: "error",
          message: "IDs parameter is required",
        });
      }

      const idArray = ids.split(",").map((id) => parseInt(id.trim()));

      const variants = await sequelize.query(
        `
        SELECT 
          pv.id,
          pv.product_id,
          pv.color as variant_name,
          pv.sku,
          pv.price,
          pv.sale_price,
          pv.stock_quantity,
          pv.image_url,
          pv.is_active,
          pv.storage as capacity,
          p.name as product_name,
          1 as quantity
        FROM product_variants pv
        JOIN products p ON pv.product_id = p.id
        WHERE pv.id IN (:ids)
        AND pv.is_active = true
        ORDER BY pv.id
      `,
        {
          replacements: { ids: idArray },
          type: QueryTypes.SELECT,
        }
      );

      res.json({
        status: "success",
        message: `Found ${variants.length} variants`,
        data: variants,
      });
    } catch (error) {
      console.error("Error getting variants by IDs:", error);
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },
};

module.exports = productVariantController;
