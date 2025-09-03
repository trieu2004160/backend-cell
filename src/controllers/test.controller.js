const { successResponse } = require("../utils/response.util");

const testLogin = async (req, res) => {
  try {
    // Mock user data để test
    const mockUser = {
      id: "1",
      email: "test@gmail.com",
      full_name: "Nguyen Van Test",
      phone: "0123456789",
      password_hash: null,
      date_of_birth: null,
      gender: null,
      avatar_url: "https://via.placeholder.com/100",
      status: "active",
      email_verified: true,
      phone_verified: false,
      provider: "google",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      access_token: "mock_access_token_12345",
      refresh_token: "mock_refresh_token_12345",
    };

    successResponse(res, "Test login successfully!", mockUser);
  } catch (error) {
    console.log("Test login error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = {
  testLogin,
};
