const express = require('express');
const { validationSignup } = require('../utilis/Validation');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const authRouters = express.Router();

authRouters.post(
  "/signup",
  validationSignup,
  async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      await user.save();
      res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
);

authRouters.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = jwt.sign({ userId: user._id }, 'DevTinder@17');
    res.cookie("token", token, { httpOnly: true, sameSite: 'lax' });

    res.json({ message: "Login successful", token });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

authRouters.post("/logout", (req, res) => {
  res.clearCookie("token",null,{
    expires : new Date(Date.now()),
  });
  res.send();
});

module.exports = authRouters;