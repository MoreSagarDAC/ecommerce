import UserModel from "../../models/user.model.js";
import bcrypt from "bcrypt";
// Email sending code commented out - normal registration without email verification
// import { generateOTP, sendRegistrationOTP } from "../email/emailService.js";

const initiateRegistration = async (userData) => {
  const { name, email, password } = userData;
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  // Email OTP code commented out - direct registration
  // // Generate OTP
  // const otp = generateOTP();
  // const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Prepare user data with all fields from body
  const userDataToSave = {
    ...userData, // Save all fields from body (name, email, phone_number, avatar, etc.)
    password: hashedPassword, // Replace plain password with hashed password
    // OTP fields commented out - direct registration
    // registration_otp: otp,
    // registration_otp_expiry: otpExpiry,
    verify_email: true, // Directly verified - no email verification needed
  };

  console.log("userDataToSave", userDataToSave);

  // Create user with all body fields - directly verified
  // All fields from req.body will be saved to MongoDB
  const user = await UserModel.create(userDataToSave);

  // Email sending code commented out - normal registration without email
  // // Send OTP email
  // const emailResult = await sendRegistrationOTP(email, name, otp);
  // console.log("emailResult", emailResult);
  // if (!emailResult.success) {
  //   // If email fails, delete the user record
  //   await UserModel.findByIdAndDelete(user._id);
  //   throw new Error("Failed to send OTP email. Please try again.");
  // }

  // Return user without sensitive data
  const userResponse = user.toObject();
  delete userResponse.password;
  // delete userResponse.registration_otp;
  // delete userResponse.registration_otp_expiry;

  return userResponse;
};

const verifyRegistrationOTP = async (email, otp) => {
  // Step 3: OTP Verification
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  // Check if email is already verified
  if (user.verify_email) {
    throw new Error("Email is already verified");
  }

  // Check if OTP exists
  if (!user.registration_otp) {
    throw new Error("OTP not found. Please request a new OTP.");
  }

  // Check if OTP is expired
  if (new Date() > user.registration_otp_expiry) {
    await UserModel.findByIdAndUpdate(user._id, {
      registration_otp: "",
      registration_otp_expiry: "",
    });
    throw new Error("OTP has expired. Please request a new OTP.");
  }

  // Verify OTP
  if (user.registration_otp !== otp) {
    throw new Error("Invalid OTP. Please try again.");
  }

  // Step 4: OTP is correct, verify email and clear OTP
  // All body data is already saved, just mark as verified
  const updatedUser = await UserModel.findOneAndUpdate(
    { email, registration_otp: otp }, // Match condition
    {
      $set: {
        verify_email: true,
        registration_otp: "",
        registration_otp_expiry: "",
      },
    },
    {
      new: true, // Return updated document
      runValidators: true, // Run schema validators
    }
  );

  if (!updatedUser) {
    throw new Error("Failed to update user. Please try again.");
  }

  // Return user without sensitive data
  const userResponse = updatedUser.toObject();
  delete userResponse.password;
  delete userResponse.registration_otp;
  delete userResponse.registration_otp_expiry;

  return userResponse;
};

export { initiateRegistration, verifyRegistrationOTP };
