const { verifyToken } = require("../utils/token");

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    //  Check if Authorization header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    //  Verify token using centralized utility
    const decoded = verifyToken(token);

    //  If verification failed
    if (!decoded) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }

    //  Attach user data to request
    req.user = decoded;

    // Continue to next middleware/controller
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(401).json({ message: "Unauthorized. Invalid or expired token." });
  }
};

module.exports = authMiddleware;
