const jwt = require("jsonwebtoken");

/**
 * Generates a JWT token for a user.
 * @param {Object} user - The user object.
 * @returns {string} - The generated JWT token.
 */
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
  );

  return { accessToken, refreshToken };
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
 * Verifies a refresh token.
 * @param {string} token - The refresh token to verify.
 * @returns {Promise<Object>} - A promise that resolves to the decoded token.
 */
const verifyRefreshToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
};

/**
 * Sets a JWT token in a cookie.
 * @param {Object} res - The response object.
 * @param {string} token - The JWT token to set in the cookie.
 */
const setTokenCookies = (res, { accessToken, refreshToken }) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: process.env.NODE_ENV === "production", // Set to true in production to use HTTPS
    sameSite: "strict", // Helps prevent CSRF attacks
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: process.env.NODE_ENV === "production", // Set to true in production to use HTTPS
    sameSite: "strict", // Helps prevent CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
};

module.exports = { 
  generateTokens, 
  verifyRefreshToken, 
  setTokenCookies,
  verifyToken: (token) => jwt.verify(token, process.env.JWT_SECRET)
};