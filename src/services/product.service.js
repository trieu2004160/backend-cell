const {
  checkNameExist,
  checkSlugExist,
  checkSkuExist,
  createProductRepository,
  getAllProductReposiroty,
  deleteProductRepository,
  updateProductRepository,
  getAllNameProductRepository,
  getProductByIdRepository,
} = require("../repositories/product.repository");

const createProductService = async (payload) => {
  const { name, slug, sku } = payload;

  const nameProduct = await checkNameExist(name);
  if (nameProduct) throw new Error("Product is already exist!");

  const slugProduct = await checkSlugExist(slug);
  if (slugProduct) throw new Error("Slug is already exist!");

  const skuBrand = await checkSkuExist(sku);
  if (skuBrand) throw new Error("Sku is already exist!");

  return await createProductRepository(payload);
};

const getAllProductService = async (options = {}) => {
  return await getAllProductReposiroty(options);
};

const deleteProductService = async (id) => {
  return await deleteProductRepository(id);
};

const updateProductService = async (id, payload) => {
  const { name, slug, sku } = payload;

  // Get current product to compare
  const currentProduct = await getProductByIdRepository(id);
  if (!currentProduct) {
    throw new Error("Product not found");
  }

  // Only check if name changed
  if (name && name !== currentProduct.name) {
    const nameProduct = await checkNameExist(name);
    if (nameProduct && nameProduct.id !== parseInt(id)) {
      throw new Error("Product name is already exist!");
    }
  }

  // Only check if slug changed
  if (slug && slug !== currentProduct.slug) {
    const slugProduct = await checkSlugExist(slug);
    if (slugProduct && slugProduct.id !== parseInt(id)) {
      throw new Error("Slug is already exist!");
    }
  }

  // Only check if sku changed
  if (sku && sku !== currentProduct.sku) {
    const skuProduct = await checkSkuExist(sku);
    if (skuProduct && skuProduct.id !== parseInt(id)) {
      throw new Error("SKU is already exist!");
    }
  }

  return await updateProductRepository(id, payload);
};

const getAllNameProductService = async () => {
  const result = await getAllNameProductRepository();
  const customResult = result.map((item) => {
    return {
      value: Number(item.id),
      label: item.name,
    };
  });
  return customResult;
};

const getProductByIdService = async (id) => {
  const product = await getProductByIdRepository(id);
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
};

module.exports = {
  createProductService,
  getAllProductService,
  deleteProductService,
  updateProductService,
  getAllNameProductService,
  getProductByIdService,
};
