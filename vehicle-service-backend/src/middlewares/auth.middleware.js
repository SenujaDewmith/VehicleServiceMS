const jwt = require("jsonwebtoken");
const logger = require("../utils/logger"); // adjust path if needed
require("dotenv").config();

const verifyToken = (req, res, next) => {
  // Token comes from HttpOnly cookie — not the Authorization header
  const token = req.cookies?.token;

  if (!token) {
    logger.warn(
      `Auth failed — no token in cookies | ${req.method} ${req.originalUrl}`,
    );
    return res
      .status(401)
      .json({ message: "Access denied. Not authenticated." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { user_id, email, role_id }
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      logger.warn(
        `Auth failed — token expired | user may have been: ${error?.expiredAt}`,
      );
      return res
        .status(401)
        .json({ message: "Session expired. Please log in again." });
    }

    logger.error(`Auth failed — invalid token | ${error.message}`);
    return res.status(403).json({ message: "Invalid token." });
  }
};

module.exports = { verifyToken };
