const jwt = require("jsonwebtoken");

/**
 * Generates a JWT token for a user.
 * @param {Object} user - The user object.
 * @returns {string} - The generated JWT token.
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" } // Token expires in 1 day
  );
};

/**
 * Verifies a JWT token.
 * @param {string} token - The JWT token to verify.
 * @returns {Promise<Object>} - A promise that resolves to the decoded token.
 */
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
};

/**
 * Sets a JWT token in a cookie.
 * @param {Object} res - The response object.
 * @param {string} token - The JWT token to set in the cookie.
 */
const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: process.env.NODE_ENV === "production", // Set to true in production to use HTTPS
    sameSite: "Strict", // Helps prevent CSRF attacks
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
  });
};

module.exports = { generateToken, verifyToken, setTokenCookie };