const jwt = require("jsonwebtoken");

const generateToken = (id, email) =>
  jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: "7d" });

module.exports = generateToken;
