import jwt from "jsonwebtoken";

const getRefreshSecret = () =>
  process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;

const generateToken = (userId, role) => {
  const token = jwt.sign(
    {
      userId: userId.toString(),
      role: role,
      type: "access",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );
  return token;
};

const generateRefreshToken = (userId) => {
  const refreshToken = jwt.sign(
    {
      userId: userId.toString(),
      type: "refresh",
    },
    getRefreshSecret(),
    {
      expiresIn: "7d",
    },
  );
  return refreshToken;
};

const verifyRefreshToken = (refreshToken) =>
  jwt.verify(refreshToken, getRefreshSecret());

export { generateToken, generateRefreshToken, verifyRefreshToken };
