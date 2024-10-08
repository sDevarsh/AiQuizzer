const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ $or: [{ email }] });
    if (user) {
      return this.login(req, res);
      // as we want mock authentication so will work any thing
    }

    user = new User({ email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error });
  }
};
