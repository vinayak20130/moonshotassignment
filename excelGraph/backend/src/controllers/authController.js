const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const authController = {
  logout: async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw error.response?.data || error.message;
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error("Invalid login credentials");
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      res.cookie("token", token, { httpOnly: true });
      res.json({ user: { email: user.email }, token });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  },
  signup: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const user = new User({
        email,
        password,
      });

      await user.save();

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

      res.status(201).json({
        success: true,
        user: { email: user.email },
        token,
      });
    } catch (error) {
      console.error("Signup Error:", error);
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = authController;
