const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies; // ✅ FIXED

    if (!token) {
      throw new Error("Unauthorized");
    }

    const decoded = jwt.verify(token, 'DevTinder@17');
    const { userId } = decoded;

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Unauthorized");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { userAuth };
