import UserModel from "../../models/user.model.js";
import bcrypt from "bcrypt";
import { generateToken, generateRefreshToken } from "../../utils/token.js";
import CryptoJS from "crypto-js";

const userLogin = async (email, password) => {
  // Extract original values by decrypting if encrypted
  let decryptedEmail = email;
  let decryptedPassword = password;

  // Decrypt email if encrypted (CryptoJS format starts with "U2FsdGVkX1")
  if (email && email.startsWith("U2FsdGVkX1")) {
    try {
      const key =
        process.env.VITE_ENCRYPTION_KEY ||
        process.env.ENCRYPTION_KEY ||
        process.env.JWT_SECRET ||
        "default-secret-key";
      const bytes = CryptoJS.AES.decrypt(email, key);
      decryptedEmail = bytes.toString(CryptoJS.enc.Utf8);
      if (!decryptedEmail) {
        throw new Error("Decryption failed");
      }
    } catch (error) {
      throw new Error("Invalid encrypted email format");
    }
  }

  // Decrypt password if encrypted
  if (password && password.startsWith("U2FsdGVkX1")) {
    try {
      const key =
        process.env.VITE_ENCRYPTION_KEY ||
        process.env.ENCRYPTION_KEY ||
        process.env.JWT_SECRET ||
        "default-secret-key";
      const bytes = CryptoJS.AES.decrypt(password, key);
      decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
      if (!decryptedPassword) {
        throw new Error("Decryption failed");
      }
    } catch (error) {
      throw new Error("Invalid encrypted password format");
    }
  }

  const user = await UserModel.findOne({ email: decryptedEmail });
  if (!user) {
    throw new Error("User not found");
  }
  const isPasswordCorrect = await bcrypt.compare(
    decryptedPassword,
    user.password
  );
  if (!isPasswordCorrect) {
    throw new Error("Invalid password");
  }
  const token = await generateToken(user._id);
  const refreshToken = await generateRefreshToken(user._id);

  // Update user with tokens and last login date
  await UserModel.findByIdAndUpdate(
    user._id,
    {
      $set: {
        token: token,
        refreshToken: refreshToken,
        last_login_date: new Date(),
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  // Return user data without sensitive information
  const userResponse = user.toObject();
  delete userResponse.password;
  delete userResponse.token;
  delete userResponse.refreshToken;

  return { user: userResponse, token, refreshToken };
};

export default userLogin;
