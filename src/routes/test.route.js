const express = require("express");
const { testLogin } = require("../controllers/test.controller");
const routes = express.Router();

routes.post("/login", testLogin);

module.exports = routes;
