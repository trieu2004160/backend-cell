const axios = require("axios");

module.exports = {
  getGoogleUserInfo: async (accessToken) => {
    try {
      console.log("🔍 Calling Google API with token:", accessToken);

      const response = await axios.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("✅ Google API response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Google API error:",
        error.response?.data || error.message
      );
      throw new Error(
        `Google API failed: ${error.response?.data?.error || error.message}`
      );
    }
  },
};
