const express = require("express");
const {
  menuSmartPhoneController,
  menuLaptopController,
} = require("../controllers/menu.controller");
const routes = express.Router();

routes.get("/", menuSmartPhoneController);
routes.get("/laptop", menuLaptopController);

// Test endpoint
routes.get("/test-laptop", (req, res) => {
  const testData = [
    {
      title: "Thương hiệu TEST",
      content: [
        { name: "Apple TEST" },
        { name: "Samsung TEST" },
        { name: "ASUS TEST" },
      ],
    },
  ];
  res.json({
    status: "success",
    message: "Test laptop menu",
    data: testData,
  });
});

module.exports = routes;
