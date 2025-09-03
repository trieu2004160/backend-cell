const FormData = require("form-data");
const fs = require("fs");
const axios = require("axios");

console.log("🧪 TESTING UPLOAD API WITH CLOUDINARY");
console.log("=====================================");

// Create a minimal test image (1x1 pixel PNG)
const testImageBuffer = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64"
);
fs.writeFileSync("test_image.png", testImageBuffer);

const form = new FormData();
form.append("file", fs.createReadStream("test_image.png"));

axios
  .post("http://127.0.0.1:3000/api/upload", form, {
    headers: {
      ...form.getHeaders(),
      "Content-Type": "multipart/form-data",
    },
  })
  .then((response) => {
    console.log("✅ Upload successful!");
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(response.data, null, 2));

    // Clean up test file
    fs.unlinkSync("test_image.png");
  })
  .catch((error) => {
    console.log("❌ Upload failed!");
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Error:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.log("Error:", error.message);
    }

    // Clean up test file
    if (fs.existsSync("test_image.png")) {
      fs.unlinkSync("test_image.png");
    }
  });
