import UserModel from "../../models/user.model.js";
import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";

const decryptField = (value) => {
  if (!value || !value.startsWith("U2FsdGVkX1")) return value;
  const key =
    process.env.VITE_ENCRYPTION_KEY ||
    process.env.ENCRYPTION_KEY ||
    process.env.JWT_SECRET ||
    "default-secret-key";
  const bytes = CryptoJS.AES.decrypt(value, key);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  if (!decrypted) throw new Error("Decryption failed");
  return decrypted;
};

const initiateRegistration = async (userData) => {
  const decryptedEmail = decryptField(userData.email);
  const decryptedPassword = decryptField(userData.password);

  const existingUser = await UserModel.findOne({ email: decryptedEmail });
  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(decryptedPassword, 10);

  const userDataToSave = {
    ...userData,
    email: decryptedEmail,
    password: hashedPassword,
    verify_email: true,
  };

  const user = await UserModel.create(userDataToSave);

  const userResponse = user.toObject();
  delete userResponse.password;

  return userResponse;
};

export { initiateRegistration };
