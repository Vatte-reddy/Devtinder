const express = require("express");

const profileRouters = express.Router();
const { userAuth } = require("../middleWare/auth");
const { validateProfileEdit } = require("../utilis/Validation");

// View profile
profileRouters.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (e) {
    console.error(e);
    res.status(401).json({ message: "Unauthorized" });
  }
});

// Edit profile
profileRouters.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEdit(req)) {
      throw new Error("Invalid profile data");
    }

    const loggedUser = req.user;

    Object.keys(req.body).forEach((key) => {
      loggedUser[key] = req.body[key];
    });

    await loggedUser.save();

    res.json({
      message: `${loggedUser.firstName}, your profile updated successfully`,
      data: loggedUser,
    });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ message: e.message });
  }
});

module.exports = profileRouters;