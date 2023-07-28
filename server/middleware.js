require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

module.exports = {
  auth: (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(403).json({ msg: "Missing auth header" });
    }

    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded && decoded.id) {
        // Checking if decoded ID exists
        req.userId = decoded.id;
        next();
      } else {
        return res.status(403).json({ msg: "Incorrect token" });
      }
    } catch (error) {
      console.error("Error occurred while verifying token", error);
      return res.status(500).json({ msg: "Internal server error" });
    }
  },
};
