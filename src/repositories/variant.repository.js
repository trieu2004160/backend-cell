const ProductVariant = require("../models/variant.model");
const { Op } = require("sequelize");

const createVariant = async (data) => {
    return await ProductVariant.create(data);
};

const getVariantsByProductId = async (productId) => {
    return await ProductVariant.findAll({
        where: { product_id: productId },
        order: [["is_default", "DESC"], ["created_at", "ASC"]],
    });
};

const getVariantById = async (id) => {
    return await ProductVariant.findByPk(id);
};

const updateVariant = async (id, data) => {
    const variant = await ProductVariant.findByPk(id);
    if (!variant) {
        throw new Error("Variant not found");
    }
    return await variant.update(data);
};

const deleteVariant = async (id) => {
    const variant = await ProductVariant.findByPk(id);
    if (!variant) {
        throw new Error("Variant not found");
    }
    return await variant.destroy();
};

const setDefaultVariant = async (productId, variantId) => {
    // Unset all defaults for this product
    await ProductVariant.update(
        { is_default: false },
        { where: { product_id: productId } }
    );

    // Set the new default
    const variant = await ProductVariant.findByPk(variantId);
    if (!variant || variant.product_id !== parseInt(productId)) {
        throw new Error("Variant not found or does not belong to this product");
    }

    return await variant.update({ is_default: true });
};

const checkSkuExists = async (sku, excludeId = null) => {
    const where = { sku };
    if (excludeId) {
        where.id = { [Op.ne]: excludeId };
    }
    return await ProductVariant.findOne({ where });
};

module.exports = {
    createVariant,
    getVariantsByProductId,
    getVariantById,
    updateVariant,
    deleteVariant,
    setDefaultVariant,
    checkSkuExists,
};
