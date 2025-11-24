require("dotenv").config();
const axios = require("axios");

// Use IPv4 explicitly
const API_URL = "http://127.0.0.1:3000/api";

const testProduct = {
    name: "Điện thoại iPhone 16 Pro Max 256GB",
    slug: "16prm",
    sku: "16prm",
    original_price: 30437000,
    sale_price: 28437000,
    cost_price: 2000000,
    rating_average: 9,
    rating_count: 8,
    short_description: "Máy mới 100%, chính hang Apple Việt Nam",
    description: "Điện thoại iPhone 16 Pro Max mới nhất",
    category_id: 2,
    brand_id: 1,
    warranty_period: 12,
    dimensions: "10x10x10",
    status: "active",
    weight: 10,
    is_featured: true,
    meta_title: "iPhone 16 Pro Max",
    meta_description: "iPhone 16 Pro Max description"
};

(async () => {
    try {
        console.log("🔍 Testing product creation with IPv4...\n");

        const response = await axios.post(`${API_URL}/products`, testProduct);

        console.log("\n✅ SUCCESS!");
        console.log("Response:", JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.log("\n❌ ERROR!");

        if (error.response) {
            console.log("Status:", error.response.status);
            console.log("Status Text:", error.response.statusText);
            console.log("Error data:", JSON.stringify(error.response.data, null, 2));

            // Check for specific validation errors
            if (error.response.data.errors) {
                console.log("\n📋 Validation Errors:");
                error.response.data.errors.forEach(err => {
                    console.log(`  - ${err.field}: ${err.message}`);
                });
            }
        } else if (error.request) {
            console.log("No response from server");
            console.log("Error:", error.message);
        } else {
            console.log("Error:", error.message);
        }
    }
})();
