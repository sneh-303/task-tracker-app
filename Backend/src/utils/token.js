const jwt = require("jsonwebtoken");
require("dotenv").config();


const TOKEN_EXPIRY =  "1d";

const generateToken = (payload) => {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Token generation failed");
  }
};


const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("Token verification failed:", error.message);
    throw error; 
  }
};

module.exports = { generateToken, verifyToken, TOKEN_EXPIRY };
