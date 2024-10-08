const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/auth.middleware");

const Manga = require("../models/manga");
const FavouriteManga = require("../models/favouriteManga");
const { ROLE } = require("../utils/database");
const mangaModel = require("../models/manga.model");
const numberUtils = require("../utils/numberUtils");
const fileUpload = require("express-fileupload");
const filePayloadExists = require("../middleware/filePayloadExists.middleware");
const fileExtLimiter = require("../middleware/fileExtLimiter.middleware");
const fileSizeLimiter = require("../middleware/fileSizeLimiter.middleware");
const multer = require("multer");
const firebase = require("firebase/app");
// const getAnalytics = require("firebase/analytics");
const {
  getStorage,
  ref,
  deleteObject,
  getDownloadURL,
  uploadBytesResumable,
  listAll,
  list,
} = require("firebase/storage");
const firebaseConfig = require("../config/firebase.config");
const getCurrentDateTime = require("../utils/timeUtils");

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const storage = getStorage();
const upload = multer({ storage: multer.memoryStorage() });

// @route POST api/manga
// @desc Create manga
// @access Private
router.post("/", verifyToken, async (req, res) => {
  const {
    name,
    description,
    thumbUrl,
    genres,
    authors,
    artists,
    transTeam,
    status,
  } = req.body;
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
    const newManga = new Manga({
      name,
      description,
      thumbUrl: thumbUrl
        ? thumbUrl.startsWith("https://")
          ? thumbUrl
          : `https://${thumbUrl}`
        : "",
      genres: genres || [],
      authors: authors || [],
      artists: artists || [],
      transTeam: transTeam || "",
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
// @desc Get all manga
// @access Public

router.get("/", async (req, res) => {
  const { page, limit, sortByViews, sortByLatestUpdate } = req.query;
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
  if (sortByViews) {
    if (
      !numberUtils.isNumberic(sortByViews) ||
      (numberUtils.toNum(sortByViews) !== -1 &&
        numberUtils.toNum(sortByViews) !== 1)
    )
      return res.status(400).json({
        success: false,
        message: "Invalid data",
      });
  }
  if (sortByLatestUpdate) {
    if (
      !numberUtils.isNumberic(sortByLatestUpdate) ||
      (numberUtils.toNum(sortByLatestUpdate) !== -1 &&
        numberUtils.toNum(sortByLatestUpdate) !== 1)
    )
      return res.status(400).json({
        success: false,
        message: "Invalid data",
      });
  }
  // if (withLatestChapter) {
  //   if (
  //     !numberUtils.isNumberic(withLatestChapter) ||
  //     (numberUtils.toNum(withLatestChapter) !== -1 &&
  //       numberUtils.toNum(withLatestChapter) !== 1)
  //   )
  //     return res.status(400).json({
  //       success: false,
  //       message: "Invalid data",
  //     });
  // }
  try {
    const mangas = await mangaModel.getMore(
      {},
      page,
      limit,
      "_id name description thumbUrl rating latestUpdate authors artists transTeam genres status views chapters",
      {
        ...(sortByViews && { views: sortByViews }),
        ...(sortByLatestUpdate && { latestUpdate: sortByLatestUpdate }),
      }
    );
    res.json({
      success: true,
      data: mangas,
    });
    // const mangas = await Manga.find().populate("genres");
    // res.json({
    //   success: true,
    //   data: { mangas },
    // });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route GET api/manga/search
// @desc Search manga
// @access Public
router.get("/search", async (req, res) => {
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
  var conditions = {};
  if (key) {
    conditions.$text = { $search: key };
  }
  try {
    const resultMangaList = await mangaModel.getMore(
      conditions,
      page,
      limit,
      "_id name description thumbUrl rating latestUpdate authors artists transTeam genres status views"
    );
    res.json({
      success: true,
      data: resultMangaList,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }

  // try {
  //   const manga = await Manga.findOne({ _id: req.params.id }).populate(
  //     "genres"
  //   );
  //   res.json({
  //     success: true,
  //     data: { manga },
  //   });
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).json({ success: false, message: "Internal server error" });
  // }
});

// @route GET api/manga/id
// @desc Get manga by id
// @access Public

router.get("/:id", async (req, res) => {
  try {
    const manga = await Manga.findOne({ _id: req.params.id }).populate(
      "genres"
    );
    if (!manga) {
      return res.status(400).json({
        success: false,
        message: "Manga not found",
      });
    }
    let mangaObj = manga.toObject();

    // Check if authorized then set isInFavourite
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];
    let userId;
    if (!token) userId = null;
    else {
      try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        userId = decoded.userId;
      } catch (error) {
        return res.status(403).json({
          success: false,
          message: "Access token expires",
        });
        // userId = null;
      }
    }
    if (!userId) mangaObj.isInFavourite = false;
    else {
      const isInFavourite = await FavouriteManga.findOne({
        user: userId,
        manga: req.params.id,
      });
      mangaObj.isInFavourite = isInFavourite ? true : false;
    }

    res.json({
      success: true,
      data: { manga: mangaObj },
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
  if ((name && name === "") || (description && !description === "")) {
    return res.status(400).json({
      success: false,
      message: "Manga name and description are required",
    });
  }
  const oldManga = await Manga.findOne({ _id: req.params.id });
  try {
    let updatedManga = {
      name: name || oldManga?.name,
      description: description || oldManga.description,
      ...(thumbUrl && {
        thumbUrl: thumbUrl.startsWith("https://")
          ? thumbUrl
          : `https://${thumbUrl}`,
      }),
      ...(genres && { genres: genres }),
      ...(authors && { authors: authors }),
      ...(artists && { artists: artists }),
      ...(status && { status: status || 0 }),
      // latestUpdate: Date.now,
    };
    const mangaUpdateCondition = { _id: req.params.id };
    updatedManga = await Manga.findOneAndUpdate(
      mangaUpdateCondition,
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
  // Check if user is not admin
  if (req.user.role !== ROLE.ADMIN) {
    return res.status(401).json({
      success: false,
      message: "You don't have permission to update this manga",
    });
  }
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

// @route POST api/manga/uploadThumb
// @desc Upload manga thumbnail
// @access Private

router.post(
  "/uploadThumb/:id",
  verifyToken,
  fileUpload({ createParentPath: true }),
  filePayloadExists,
  fileExtLimiter([".png", ".jpg", ".jpeg"]),
  fileSizeLimiter,
  async (req, res) => {
    // Check if user is not admin
    if (req.user.role !== ROLE.ADMIN) {
      return res.status(401).json({
        success: false,
        message: "You don't have permission to update this manga",
      });
    }
    const id = req.params.id;
    const files = req.files;
    const dateTime = getCurrentDateTime();
    // Delete the previous thumnail
    const thumbnailRef = ref(storage, `manga/${id}/thumbnail`);
    var listPublicUrl = new Array();
    try {
      const listAllFileRef = await listAll(thumbnailRef);
      if (listAllFileRef.items.length) {
        listAllFileRef.items.forEach(async (itemRef) => deleteObject(itemRef));
      }
      const promises = Object.keys(files).map(async (key) => {
        const storageRef = ref(
          storage,
          `manga/${id}/thumbnail/${files[key].name + "_" + dateTime}`
        );

        // Create file metadata including the content type
        const metadata = {
          contentType: files[key].mimetype,
        };

        // Upload the file in the bucket storage
        const snapshot = await uploadBytesResumable(
          storageRef,
          files[key].data,
          metadata
        );

        // Grab the public url
        const downloadUrl = await getDownloadURL(snapshot.ref);
        return downloadUrl;
      });
      const arrUrl = await Promise.all(promises);
      arrUrl.forEach((item) => listPublicUrl.push(item));
      const updateThumbUrlMangaRes = await Manga.updateOne(
        { _id: id },
        { $set: { thumbUrl: listPublicUrl[0] } }
      );
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }

    res.json({
      success: true,
      message: "File successfully uploaded",
      data: {
        listPublicUrl,
      },
    });
  }
);

module.exports = router;
