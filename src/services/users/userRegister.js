import UserModel from "../../models/user.model.js";
import bcrypt from "bcrypt";


const initiateRegistration = async (userData) => {
  const { name, email, password } = userData;
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Prepare user data with all fields from body
  const userDataToSave = {
    ...userData, // Save all fields from body (name, email, phone_number, avatar, etc.)
    password: hashedPassword, // Replace plain password with hashed password
    verify_email: true, 
  };

  const user = await UserModel.create(userDataToSave);

  const userResponse = user.toObject();
  delete userResponse.password;

  return userResponse;
};


export { initiateRegistration };
