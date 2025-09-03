const axios = require("axios");

async function testLaptopImages() {
  try {
    console.log("🧪 TESTING LAPTOP IMAGES FROM API");
    console.log("=================================");

    const response = await axios.get(
      "http://127.0.0.1:3000/api/products?category_id=11&all=true"
    );

    console.log(`✅ API Response Status: ${response.status}`);
    console.log(
      `📊 Total laptops: ${response.data.total || response.data.data?.length}`
    );

    const laptops = response.data.data || [];

    console.log("\n💻 LAPTOP IMAGES STATUS:");
    console.log("========================");

    let hasImages = 0;
    let noImages = 0;

    laptops.slice(0, 10).forEach((laptop, index) => {
      const imageStatus = laptop.image_url ? "✅ HAS IMAGE" : "❌ NO IMAGE";
      console.log(`${index + 1}. ${laptop.name}`);
      console.log(`   └── ${imageStatus}`);

      if (laptop.image_url) {
        console.log(`   └── URL: ${laptop.image_url}`);
        hasImages++;
      } else {
        noImages++;
      }
      console.log("");
    });

    console.log("📈 SUMMARY:");
    console.log(`✅ Products with images: ${hasImages}`);
    console.log(`❌ Products without images: ${noImages}`);

    // Test specific MacBook Pro M3
    const macbookPro = laptops.find((laptop) =>
      laptop.name.includes("MacBook Pro M3")
    );
    if (macbookPro) {
      console.log("\n🎯 MACBOOK PRO M3 DETAIL:");
      console.log("========================");
      console.log("Name:", macbookPro.name);
      console.log("Image URL:", macbookPro.image_url || "NO IMAGE");
      console.log("Category ID:", macbookPro.category_id);
      console.log("Brand ID:", macbookPro.brand_id);

      if (macbookPro.image_url) {
        console.log("\n🔗 Testing image URL accessibility...");
        try {
          const imageResponse = await axios.head(macbookPro.image_url);
          console.log(`✅ Image URL accessible: ${imageResponse.status}`);
        } catch (err) {
          console.log(`❌ Image URL not accessible: ${err.message}`);
        }
      }
    }
  } catch (error) {
    console.error("❌ Error testing laptop images:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
  }
}

testLaptopImages();
