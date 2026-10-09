import UserModel from "../../models/user.model.js";
import { generateToken, verifyRefreshToken } from "../../utils/token.js";

const createAuthError = (message, code, statusCode = 401) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  return error;
};

const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw createAuthError(
      "Refresh token is required",
      "AUTH_REQUIRED",
    );
  }

  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw createAuthError(
        "Refresh token expired",
        "REFRESH_TOKEN_EXPIRED",
      );
    }

    throw createAuthError(
      "Invalid refresh token",
      "INVALID_TOKEN",
    );
  }

  if (decoded.type && decoded.type !== "refresh") {
    throw createAuthError(
      "Invalid refresh token",
      "INVALID_TOKEN",
    );
  }

  const user = await UserModel.findById(decoded.userId);

  if (!user || user.refreshToken !== refreshToken) {
    throw createAuthError(
      "Invalid refresh token",
      "INVALID_TOKEN",
    );
  }

  const token = generateToken(user._id, user.role);

  await UserModel.findByIdAndUpdate(
    user._id,
    {
      $set: {
        token,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return {
    token,
    refreshToken,
  };
};

export default refreshAccessToken;
