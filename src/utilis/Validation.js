const validator = require("validator");

const validationSignup = (req) => {
  const { firstName, lastName, email, password } = req.body || {};

  if (!firstName || !lastName) {
    throw new Error("First and last name are required");
  }

  if (!email || !validator.isEmail(email)) {
    throw new Error("Invalid email address");
  }

  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }
};

const validateProfileEdit = (req) => {
  const allowFields = [
    "firstName",
    "lastName",
    "photoUrl",
    "gender",
    "age",
    "about",
  ];

  const updates = Object.keys(req.body);
  return updates.every((key) => allowFields.includes(key));


};

module.exports = { validationSignup, validateProfileEdit };