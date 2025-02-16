// middleware/authMiddleware.js
const { verifyToken } = require("../services/auth");

const authMiddleware = async (req, res, next) => {
  // Get token from Authorization header
  const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided, authorization denied." });
  }

  try {
    const decoded = await verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid." });
  }
};

module.exports = authMiddleware;