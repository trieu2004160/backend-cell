const { menuLaptopService } = require("../services/menulaptop.service");
const { errorResponse, successResponse } = require("../utils/response.util");
const { menuPhonesmartService } = require("../services/menusmartphone.service");
const menuSmartPhoneController = async (req, res) => {
  try {
    const menuSmartphone = await menuPhonesmartService();
    successResponse(
      res,
      "Get menu smartphone successfully!",
      menuSmartphone,
      200
    );
  } catch (error) {
    errorResponse(res, error);
  }
};

const menuLaptopController = async (req, res) => {
  try {
    const menuLaptop = await menuLaptopService();
    successResponse(res, "Get menu laptop successfully!", menuLaptop, 200);
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  menuLaptopController,
  menuSmartPhoneController,
};
