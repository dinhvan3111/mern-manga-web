const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");

const Genre = require("../models/genre");
// const { ROLE } = require("../utils/database");

// @route POST api/genre
// @desc Create genre
// @access Private
router.post("/", verifyToken, async (req, res) => {
  const { name, description } = req.body;
  // Check if user is not admin
  if (req.user.role !== ROLE.ADMIN) {
    return res.status(401).json({
      success: false,
      message: "You don't have permission to update this manga",
    });
  }
  // Simple validation
  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Genre name is required",
    });
  }
  try {
    const newGenre = new Genre({
      name,
      description,
    });

    await newGenre.save();
    res.json({
      success: true,
      message: "Create genre successfully",
      genre: newGenre,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const genres = await Genre.find()
      .sort({ name: 1 })
      .collation({ locale: "en", caseLevel: true });
    res.json({ success: true, data: genres });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// // @route DELETE api/genre
// // @desc Delete genre
// // @access Private
// router.delete("/:id", verifyToken, async (req, res) => {
//   try {
//     const mangatDeleteCondition = { _id: req.params.id };
//     const deletedManga = await Manga.findOneAndDelete(mangatDeleteCondition);

//     // User not authorized or manga not found
//     if (!deletedManga) {
//       return res.status(401).json({
//         success: false,
//         message: "Manga not found or user not authorized",
//       });
//     }
//     res.json({
//       success: true,
//       message: "Delete manga successfully",
//       post: deletedManga,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// });

module.exports = router;
