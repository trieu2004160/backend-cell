const express = require("express");
const router = express.Router();

console.log("Simple admin variants route loaded");

// Test route
router.get("/test", (req, res) => {
  res.json({
    status: "success",
    message: "Admin variants route is working!",
    timestamp: new Date().toISOString(),
  });
});

// Simple variants list
router.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Getting all variants",
    data: [],
    note: "This is a test response - real database integration coming soon",
  });
});

module.exports = router;
