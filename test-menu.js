const { getBrandByCategory } = require("./src/repositories/brand.repository");

async function testMenu() {
  try {
    console.log("Testing getBrandByCategory(11)...");
    const brands = await getBrandByCategory(11);
    console.log("Result:", brands);

    const menuData = [
      {
        title: "Thương hiệu",
        content: brands,
      },
      {
        title: "Test Static",
        content: [{ name: "Apple Test" }, { name: "Samsung Test" }],
      },
    ];

    console.log("Final menu data:", JSON.stringify(menuData, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
  process.exit(0);
}

testMenu();
