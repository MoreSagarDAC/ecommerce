import UserModel from "../../models/user.model.js";

const userLogout = async (userId) => {
  // Find user by ID
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // Clear token and refreshToken in database
  await UserModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        token: "",
        refreshToken: "",
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return { message: "Logout successful" };
};

export default userLogout;
