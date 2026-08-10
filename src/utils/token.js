import jwt from "jsonwebtoken";
const generateToken = async (userId) => {
  const token = await jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "3h",
  });
  return token;
};

const generateRefreshToken = async (userId) => {
  const refreshToken = await jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return refreshToken;
};

export { generateToken, generateRefreshToken };
