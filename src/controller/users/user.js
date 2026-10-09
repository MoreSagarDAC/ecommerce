import {
  initiateRegistration,
} from "../../services/users/userRegister.js";
import userLogin from "../../services/users/userLogin.js";
import userLogoutService from "../../services/users/userLogout.js";
import refreshAccessToken from "../../services/users/refreshToken.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
        status: false,
        error: true,
      });
    }

    const user = await initiateRegistration(req.body);

    return res.status(200).json({
      message: "User registered successfully",
      status: true,
      user: user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Registration failed",
      status: false,
      error: true,
    });
  }
};



const userExistingLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userLogin(email, password);
    return res.status(200).json({
      message: "Login successful",
      status: true,
      user: user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Login failed",
      status: false,
      error: true,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshTokenValue =
      req.body?.refreshToken || req.body?.refresh_token;

    const tokens = await refreshAccessToken(refreshTokenValue);

    return res.status(200).json({
      message: "Token refreshed successfully",
      status: true,
      token: tokens.token,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    return res.status(error.statusCode || 401).json({
      message: error.message || "Unable to refresh token",
      status: false,
      error: true,
      code: error.code || "INVALID_TOKEN",
    });
  }
};

const userLogout = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "UserId is required",
        status: false,
        error: true,
      });
    }

    const result = await userLogoutService(userId);
    return res.status(200).json({
      message: "Logout successful",
      status: true,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Logout failed",
      status: false,
      error: true,
    });
  }
};
export { registerUser, userExistingLogin, userLogout, refreshToken };
