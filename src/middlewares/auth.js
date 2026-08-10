import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    // Extract token from Authorization header (Bearer token) or cookies
    // Handle undefined cookies safely
    const cookies = req.cookies || {};
    let token = req.headers.authorization || cookies.token;

    // If token is in "Bearer <token>" format, extract just the token
    if (token && token.startsWith("Bearer ")) {
      token = token.substring(7); // Remove "Bearer " prefix
    }


    if (!token) {
      return res.status(401).json({ message: "Provide token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default authMiddleware;
