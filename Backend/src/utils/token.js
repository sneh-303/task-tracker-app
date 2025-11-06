
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Generate JWT Token
const generateToken = (payload, expiresIn = "1d") => {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Token generation failed");
  }
};

// Verify JWT Token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("Token verification failed:", error);
    return null; 
  }
};

module.exports = { generateToken, verifyToken };
