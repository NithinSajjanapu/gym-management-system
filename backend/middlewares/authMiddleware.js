const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {

    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    token = token.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.admin = decoded;

    next();

  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.admin.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

module.exports = { protect, adminOnly };