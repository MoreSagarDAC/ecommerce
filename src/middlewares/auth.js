import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
// authentication middleware

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        code: "AUTH_REQUIRED",
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        code: "USER_NOT_FOUND",
        message: "User not found",
      });
    }

    req.user = {
      id: user._id,
      role: user.role,
    };
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        code: "TOKEN_EXPIRED",
        message: "Session expired",
      });
    }

    return res.status(401).json({
      success: false,
      code: "INVALID_TOKEN",
      message: "Invalid authentication token",
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You are not authorized to perform this action",
      });
    }

    next();
  };
};
