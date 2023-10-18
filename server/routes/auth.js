const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const verifyToken = require("../middleware/auth.middleware");

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXP,
  });
}
function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXP,
  });
}

// @route GET api/auth/refresh
// @desc Refresh jwt token
// @access Public
router.post("/refresh", async (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return res
      .status(401)
      .json({ success: true, message: "Refresh token is required" });
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err)
      return res.status(406).json({
        success: false,
        message: "Refresh token is not valid or expired",
      });
    // Correct token we send a new access token
    const accessToken = generateAccessToken({
      userId: user.userId,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({
      userId: user.userId,
      role: user.role,
    });
    return res.json({ success: true, data: { accessToken, refreshToken } });
  });
});

// @route GET api/auth/register
// @desc Check if user is logged in
// @access Public

router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    res.json({ sucess: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route POST api/auth/register
// @desc Register user
// @access Public

router.post("/register", async (req, res) => {
  //   res.json({ success: true, message: "văn" });
  const { username, password } = req.body;
  // Simple validation
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: "Missing username and/or password" });
  try {
    // Check for existing user
    const user = await User.findOne({ username });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "Username already taken" });
    }
    // All good
    const hashedPassword = await argon2.hash(password);
    const newUser = new User({
      username,
      password: hashedPassword,
      role: 2,
    });
    await newUser.save();
    // Return token
    const accessToken = generateAccessToken({
      userId: newUser._id,
      role: newUser.role,
    });
    const refreshToken = generateRefreshToken({
      userId: newUser._id,
      role: newUser.role,
    });
    res.json({
      success: true,
      message: "User created successfully",
      data: {
        // user: newUser,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route POST api/auth/login
// @desc Login user
// @access Public
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: "Missing username and/or password" });
  try {
    // Check for existing user
    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect username or password" });
    }

    // Username found
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect username or password" });
    }
    // All good
    // Return token
    const accessToken = generateAccessToken({
      userId: user._id,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({
      userId: user._id,
      role: user.role,
    });
    // Remove password
    const returnUser = JSON.parse(JSON.stringify(user));
    delete returnUser["password"];
    res.json({
      success: true,
      message: "Login successfully",
      data: {
        user: returnUser,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// router.get("/", (req, res) => res.json({ name: "văn" }));
// router.post("/", (req, res) => {
//   return res.json({ name: "post" });
// });

module.exports = router;
