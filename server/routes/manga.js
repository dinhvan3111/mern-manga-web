const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");

const Manga = require("../models/manga");
const { ROLE } = require("../utils/database");

// @route POST api/manga
// @desc Create manga
// @access Private
router.post("/", verifyToken, async (req, res) => {
  const { name, description, thumbUrl, genres, authors, artists } = req.body;

  // Simple validation
  if (!name || !description) {
    return res.status(400).json({
      success: false,
      message: "Manga name and description are required",
    });
  }
  try {
    const newManga = new Manga({
      name,
      description,
      thumbUrl: thumbUrl.startsWith("https://")
        ? thumbUrl
        : `https://${thumbUrl}`,
      genres: genres || [],
      authors: authors || [],
      artists: artists || [],
    });

    await newManga.save();
    res.json({
      success: true,
      message: "Create manga successfully",
      manga: newManga,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route GET api/manga
// @desc Get manga
// @access Private

router.get("/", verifyToken, async (req, res) => {
  try {
    const mangas = await Manga.find();
    res.json({
      success: true,
      mangas,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route PUT api/manga
// @desc Update manga
// @access Private
router.put("/:id", verifyToken, async (req, res) => {
  const { name, description, thumbUrl, genres, authors, artists, status } =
    req.body;
  // Check if user is not admin
  if (req.user.role !== ROLE.ADMIN) {
    return res.status(401).json({
      success: false,
      message: "You don't have permission to update this manga",
    });
  }
  // Simple validation
  if (!name || !description) {
    return res.status(400).json({
      success: false,
      message: "Manga name and description are required",
    });
  }
  try {
    let updatedManga = {
      name,
      description,
      ...(thumbUrl && {
        thumbUrl: thumbUrl.startsWith("https://")
          ? thumbUrl
          : `https://${thumbUrl}`,
      }),
      ...(genres && { genres: genres }),
      ...(authors && { authors: authors }),
      ...(artists && { artists: artists }),
      ...(status && { status: status || "ON GOING" }),
      // latestUpdate: Date.now,
    };
    const postUpdateCondition = { _id: req.params.id };
    updatedManga = await Manga.findOneAndUpdate(
      postUpdateCondition,
      updatedManga,
      { new: true }
    );
    // User not authorized to update post or post not found
    if (!updatedManga) {
      return res.status(401).json({
        success: false,
        message: "Manga not found or user not authorized",
      });
    }
    res.json({
      success: true,
      message: "Update manga successfully",
      manga: updatedManga,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route DELETE api/manga
// @desc Delete manga
// @access Private
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const mangatDeleteCondition = { _id: req.params.id };
    const deletedManga = await Manga.findOneAndDelete(mangatDeleteCondition);

    // User not authorized or manga not found
    if (!deletedManga) {
      return res.status(401).json({
        success: false,
        message: "Manga not found or user not authorized",
      });
    }
    res.json({
      success: true,
      message: "Delete manga successfully",
      post: deletedManga,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
