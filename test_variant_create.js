require("dotenv").config();
const axios = require("axios");

const API_URL = "http://127.0.0.1:3000/api";

const testData = {
    storage: "512",
    color: "b",
    price: 44440000,
    stock_quantity: 5,
    sku: "IP17-512",
    is_default: false,
    is_active: true
};

(async () => {
    try {
        console.log("🔍 Testing variant creation...\n");
        console.log("Product ID: 249");
        console.log("Data:", JSON.stringify(testData, null, 2));

        const response = await axios.post(`${API_URL}/products/249/variants`, testData);

        console.log("\n✅ SUCCESS!");
        console.log("Response:", JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.log("\n❌ ERROR!");

        if (error.response) {
            console.log("Status:", error.response.status);
            console.log("Status Text:", error.response.statusText);
            console.log("\n📋 Full Error Response:");
            console.log(JSON.stringify(error.response.data, null, 2));

            if (error.response.data.stack) {
                console.log("\n📚 Stack Trace:");
                console.log(error.response.data.stack);
            }
        } else {
            console.log("Error:", error.message);
        }
    }
})();
