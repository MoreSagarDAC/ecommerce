import {
  initiateRegistration,
  verifyRegistrationOTP,
} from "../../services/users/userRegister.js";
import userLogin from "../../services/users/userLogin.js";
import userLogoutService from "../../services/users/userLogout.js";

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

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
        status: false,
        error: true,
      });
    }

    // Validate OTP format (6 digits)
    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        message: "OTP must be a 6-digit number",
        status: false,
        error: true,
      });
    }

    // Verify OTP and complete registration
    const user = await verifyRegistrationOTP(email, otp);

    return res.status(200).json({
      message: "Email verified successfully. Registration completed!",
      status: true,
      user: user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "OTP verification failed",
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
export { registerUser, verifyOTP, userExistingLogin, userLogout };
