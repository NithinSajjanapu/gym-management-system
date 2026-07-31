const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER ADMIN
exports.registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      username,
      password: hashedPassword
    });

    res.json({ message: "Admin created", admin });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN ADMIN
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(400).json({ message: "Invalid username" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: "admin"   // FIX IMPORTANT
      },
      process.env.JWT_SECRET,
      { expiresIn: "5h" }
    );

    res.json({
      message: "Login success",
      token
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
