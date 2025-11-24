require("dotenv").config();
const axios = require("axios");

const API_URL = "http://127.0.0.1:3000/api";

// Exact data from your request
const testProduct = {
    name: "Điện thoại iPhone 16 Pro Max 256GB",
    slug: "16prm",
    sku: "prm",  // Changed from "16prm" to "prm"
    original_price: 30437000,
    sale_price: 28437000,
    cost_price: 2000000,
    rating_average: 9,
    rating_count: 8,
    short_description: "Máy mới 100%, chính hang Apple Việt Nam.",
    description: "Điện thoại iPhone 16 Pro Max mới nhất được xác nhận có khà năng chống tia nước, ",
    category_id: 2,
    brand_id: 1,
    warranty_period: 12,
    dimensions: "29.1 x 21.8 x 23.7 mm",  // Changed dimensions
    status: "active",
    weight: 10,
    is_featured: true,
    meta_title: "Điện thoại iPhone 16 Pro Max mới nhất được xác nhận có khà năng chống tia nước, chống nước\nvà chống bụi đạt mức IP68 theo tiêu chuẩn IEC 60529. Với tiêu chuần này, thiết bị có thể an toàn\nờ độ sâu 6 mét lên đến 30 phút. Tuy nhiên, cần lưu ý không sạc pin iPhone 16 Pro Max khi bị ướt.",
    meta_description: "Điện thoại iPhone 16 Pro Max mới nhất được xác nhận có khà năng chống tia nước, chống nước\nvà chống bụi đạt mức IP68 theo tiêu chuẩn IEC 60529. Với tiêu chuần này"
};

(async () => {
    try {
        console.log("🔍 Testing with exact user data...\n");

        const response = await axios.post(`${API_URL}/products`, testProduct);

        console.log("\n✅ SUCCESS!");
        console.log("Response:", JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.log("\n❌ ERROR!");

        if (error.response) {
            console.log("Status:", error.response.status);
            console.log("Status Text:", error.response.statusText);
            console.log("\n📋 Full Error Response:");
            console.log(JSON.stringify(error.response.data, null, 2));
        } else {
            console.log("Error:", error.message);
        }
    }
})();
