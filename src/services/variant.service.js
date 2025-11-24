const {
  createVariant,
  getVariantsByProductId,
  getVariantById,
  updateVariant,
  deleteVariant,
  setDefaultVariant,
  checkSkuExists,
} = require("../repositories/variant.repository");

const generateSku = (productName, storage, color) => {
  // Generate SKU format: PRODUCTCODE-STORAGE-COLORCODE
  const productCode = productName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 5);

  const storageCode = storage ? storage.replace(/GB|TB/gi, "") : "";
  const colorCode = color
    ? color
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .substring(0, 3)
    : "";

  return `${productCode}-${storageCode}-${colorCode}`;
};

const createVariantService = async (productId, payload) => {
  const {
    sku,
    storage,
    color,
    original_price,
    stock_quantity,
    is_default,
    is_active,
    image_url,
  } = payload;

  // Validate required fields
  if (original_price === undefined || original_price === null) {
    throw new Error("Price is required");
  }

  // Tự động tính sale_price = original_price giảm 10%
  const sale_price = Math.round(original_price * 0.9);

  // Check if SKU already exists
  if (sku) {
    const existingSku = await checkSkuExists(sku);
    if (existingSku) {
      throw new Error("SKU already exists");
    }
  }

  // Auto-generate SKU if not provided
  let finalSku = sku;
  if (!finalSku && (storage || color)) {
    // Get product name for SKU generation
    const Product = require("../models/product.model");
    const product = await Product.findByPk(productId);
    if (product) {
      finalSku = generateSku(product.name, storage, color);
    }
  }

  const variantData = {
    product_id: productId,
    sku: finalSku,
    storage,
    color,
    original_price,
    sale_price, // Thêm sale_price tự động
    stock_quantity: stock_quantity || 0,
    is_default: is_default || false,
    is_active: is_active !== undefined ? is_active : true,
    image_url,
  };

  const variant = await createVariant(variantData);

  // If this is set as default, update product price
  if (is_default) {
    const Product = require("../models/product.model");
    await Product.update({ original_price }, { where: { id: productId } });
  }

  return variant;
};

const getVariantsByProductIdService = async (productId) => {
  return await getVariantsByProductId(productId);
};

const getVariantByIdService = async (id) => {
  const variant = await getVariantById(id);
  if (!variant) {
    throw new Error("Variant not found");
  }
  return variant;
};

const updateVariantService = async (id, payload) => {
  const { sku } = payload;

  // Check if SKU already exists (excluding current variant)
  if (sku) {
    const existingSku = await checkSkuExists(sku, id);
    if (existingSku) {
      throw new Error("SKU already exists");
    }
  }

  // Nếu có original_price mới, tự động tính sale_price
  if (payload.original_price !== undefined && payload.original_price !== null) {
    payload.sale_price = Math.round(payload.original_price * 0.9);
  }

  const variant = await updateVariant(id, payload);

  // If this is set as default, update product price
  if (payload.is_default) {
    const Product = require("../models/product.model");
    await Product.update(
      { original_price: payload.original_price || variant.original_price },
      { where: { id: variant.product_id } }
    );
  }

  return variant;
};

const deleteVariantService = async (id) => {
  return await deleteVariant(id);
};

const setDefaultVariantService = async (productId, variantId) => {
  const variant = await setDefaultVariant(productId, variantId);

  // Update product price to match default variant
  const Product = require("../models/product.model");
  await Product.update(
    { original_price: variant.original_price },
    { where: { id: productId } }
  );

  return variant;
};

module.exports = {
  createVariantService,
  getVariantsByProductIdService,
  getVariantByIdService,
  updateVariantService,
  deleteVariantService,
  setDefaultVariantService,
};
