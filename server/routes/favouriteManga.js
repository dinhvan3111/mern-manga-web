const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");
const numberUtils = require("../utils/numberUtils");
const FavouriteManga = require("../models/favouriteManga");
const favouriteMangaModel = require("../models/favouriteManga.model");

// @route POST api/favourite
// @desc Add to favourite
// @access Private
router.post("/", verifyToken, async (req, res) => {
  const { mangaId } = req.body;
  if (!mangaId) {
    return res.status(400).json({
      success: false,
      message: "Manga id is required",
    });
  }
  try {
    const addFav = new FavouriteManga({
      user: req.user.userId,
      manga: mangaId,
    });
    await addFav.save();
    res.json({
      success: true,
      message: "Add to favourite successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route DELETE api/favourite
// @desc DELETE manga from list favourite
// @access Private
router.delete("/:id", verifyToken, async (req, res) => {
  const mangaId = req.params.id;
  if (!mangaId) {
    return res.status(400).json({
      success: false,
      message: "Manga id is required",
    });
  }
  try {
    const mangatDeleteCondition = { user: req.user.userId, manga: mangaId };
    const deleteFromFav = await FavouriteManga.findOneAndDelete(
      mangatDeleteCondition
    );
    if (!deleteFromFav) {
      return res.status(401).json({
        success: false,
        message: "Manga not found or user not authorized",
      });
    }
    res.json({
      success: true,
      message: "Remove manga from favourite list successfully",
      favourite: deleteFromFav,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route GET api/favourite
// @desc Get list favourite
// @access Private
router.get("/", verifyToken, async (req, res) => {
  const { page, limit, key } = req.query;
  if (
    !numberUtils.isNumberic(page) ||
    !numberUtils.isNumberic(limit) ||
    numberUtils.toNum(page) < 0 ||
    numberUtils.toNum(limit) <= 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid data",
    });
  }
  const userId = req.user.userId;
  try {
    const conditions = { user: userId };
    const favList = await favouriteMangaModel.getMore(
      conditions,
      page,
      limit,
      "_id user manga"
    );
    res.json({ success: true, data: favList });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
