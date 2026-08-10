import jwt from "jsonwebtoken";

const generateToken = (userId, role) => {
  const token = jwt.sign(
    {
      userId: userId.toString(),
      role: role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "3h",
    },
  );
  return token;
};

const generateRefreshToken = (userId) => {
  const refreshToken = jwt.sign(
    {
      userId: userId.toString(),
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
  return refreshToken;
};

export { generateToken, generateRefreshToken };
