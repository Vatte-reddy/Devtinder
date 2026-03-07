const express = require('express');
const { validationSignup } = require('../utilis/Validation');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const authRouters = express.Router();

authRouters.post(
  "/signup",

  async (req, res) => {
    try {
      validationSignup(req)
      const { firstName, lastName, email, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      const savedUser = await user.save();
      const token = await savedUser.getJWT(password);

      res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000), });

      res.json(savedUser);

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

    if (isMatch) {
      const token = await user.getJWT(password);

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: true,
        sameSite: 'lax'
      });
      res.send(user);
    } else {
      throw new Error("Invalid credentials");
    }

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

authRouters.post("/logout", (req, res) => {
  res.clearCookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send();
});

module.exports = authRouters;