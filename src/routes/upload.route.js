const express = require("express");
const { upload } = require("../configs/cloudinary.config");
const { uploadController } = require("../controllers/upload.controller");

const routers = express.Router();

routers.post("/", upload.single("file"), uploadController);

module.exports = routers;
