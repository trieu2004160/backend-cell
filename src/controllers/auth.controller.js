require("dotenv").config();
const {
  registerUser,
  getUserByPhone,
  getUserByEmail,
} = require("../services/auth.service");
const { getGoogleUserInfo } = require("../services/google.service");
const { saveToken } = require("../services/token.service");
const { hashPassword, comparePassword } = require("../utils/bcrypt.util");
const { generateToken } = require("../utils/jwt.util");
const { successResponse, errorResponse } = require("../utils/response.util");
const { OAuth2Client } = require("google-auth-library");

const register = async (req, res) => {
  try {
    const { password_hash } = req.body;
    const password_hashed = await hashPassword(password_hash);
    const newUser = await registerUser({
      ...req.body,
      password_hash: password_hashed,
    });
    successResponse(res, "Register successfully!", newUser);
  } catch (error) {
    errorResponse(res, error);
  }
};

const login = async (req, res) => {
  try {
    const { password_login, phone } = req.body;
    const user = await getUserByPhone(phone);
    await comparePassword(password_login, user.dataValues.password_hash);
    const token = await generateToken(user.dataValues);
    await saveToken(token);
    successResponse(res, "Login successfully!", {
      ...user.dataValues,
      ...token,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

const loginWithGoogle = async (req, res) => {
  try {
    const { token } = req.body;
    console.log("🚀 Google login attempt with token:", token);

    if (!token) {
      return res.status(400).json({
        status: "error",
        message: "Token is required",
      });
    }

    console.log("📞 Calling Google service...");
    const googleUser = await getGoogleUserInfo(token);
    console.log("👤 Google user info:", googleUser);

    // Kiểm tra xem user đã tồn tại chưa
    let user;
    try {
      console.log("🔍 Checking if user exists with email:", googleUser.email);
      user = await getUserByEmail(googleUser.email);
      console.log("✅ User found:", user.dataValues);
    } catch (error) {
      console.log("ℹ️ User not found, creating new user...");
      // Nếu email chưa tồn tại, tự động tạo user mới
      if (error.message === "Email is not registered!") {
        const newUserData = {
          full_name: googleUser.name,
          email: googleUser.email,
          phone: null, // Google login không có phone
          password_hash: null, // Google login không cần password
          avatar_url: googleUser.picture,
          provider: "google",
          email_verified: true, // Google đã verify email
          status: "active", // Google users tự động active
        };
        console.log("📝 Creating user with data:", newUserData);
        user = await registerUser(newUserData);
        console.log("🎉 New user created:", user.dataValues);
      } else {
        throw error;
      }
    }

    console.log("🔑 Generating tokens...");
    const tokens = await generateToken(user.dataValues);
    await saveToken(tokens);

    const responseData = {
      ...user.dataValues,
      ...tokens,
    };
    console.log("📤 Sending response:", responseData);

    successResponse(res, "Login successfully!", responseData);
  } catch (error) {
    console.log("❌ Google login error:", error);
    errorResponse(res, error);
  }
};
module.exports = {
  register,
  login,
  loginWithGoogle,
};
