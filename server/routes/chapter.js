const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");

const Chapter = require("../models/chapter");
const Manga = require("../models/manga");
const { ROLE } = require("../utils/database");
const chapterModel = require("../models/chapter.model");
const numberUtils = require("../utils/numberUtils");
const fileUpload = require("express-fileupload");
const filePayloadExists = require("../middleware/filePayloadExists.middleware");
const fileExtLimiter = require("../middleware/fileExtLimiter.middleware");
const fileSizeLimiter = require("../middleware/fileSizeLimiter.middleware");
const multer = require("multer");
const ObjectId = require("mongodb").ObjectId;
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

// @route POST api/chapter
// @desc Add manga chapter
// @access Private
router.post("/", verifyToken, async (req, res) => {
  if (req.user.role !== ROLE.ADMIN) {
    return res.status(401).json({
      success: false,
      message: "You don't have permission to add chapter",
    });
  }
  const { mangaId, title, listThumbUrl } = req.body;
  if (!mangaId || !title) {
    return res.status(400).json({
      success: false,
      message: "Manga id and chapter's title are required",
    });
  }
  try {
    const newChapter = await Chapter({
      mangaId,
      title,
      listThumbUrl: listThumbUrl || [],
    });
    await newChapter.save();
    await Manga.findOneAndUpdate(
      { _id: mangaId },
      {
        $push: {
          chapters: newChapter._id,
        },
        latestUpdate: Date.now(),
      }
    );
    res.json({
      success: true,
      message: "Create chapter successfully",
      chapter: newChapter,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route GET api/chapter
// @desc Get all chapter
// @access Public
router.get("/:id", async (req, res) => {
  const { page, limit, sortByTime } = req.query;
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
  if (
    sortByTime &&
    (!numberUtils.isNumberic(sortByTime) ||
      (numberUtils.toNum(sortByTime) !== -1 &&
        numberUtils.toNum(sortByTime) !== 1))
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid data",
    });
  }
  const conditions = { mangaId: req.params.id };
  try {
    const chapters = await chapterModel.getMore(
      conditions,
      page,
      limit,
      "_id mangaId title listImgUrl publishDate",
      {
        ...(sortByTime && { publishDate: sortByTime }),
      }
    );
    res.json({
      success: true,
      data: chapters,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route POST api/chapter/:id/uploadListImgs
// @desc Upload chapter's image
// @access Private
router.post(
  "/:id/uploadListImgs",
  verifyToken,
  fileUpload({ createParentPath: true }),
  filePayloadExists,
  fileExtLimiter([".png", ".jpg", ".jpeg"]),
  fileSizeLimiter,
  async (req, res) => {
    const chapterId = req.params.id;
    const files = req.files;
    const chapter = await Chapter.findOne({ _id: chapterId });
    if (!chapter) {
      return res.status(400).json({
        success: false,
        message: "Couldn't find this chapter",
      });
    }
    const mangaId = new ObjectId(chapter.mangaId).valueOf();
    // console.log("chapter", chapter);
    // console.log("object", chapter.mangaId);
    // console.log("mangaId", mangaId);
    // Delete list Imgs
    const listImgsRef = ref(storage, `manga/${mangaId}/chapters/${chapterId}`);
    var listPublicUrl = new Array();
    try {
      const listAllFileRef = await listAll(listImgsRef);
      if (listAllFileRef.items.length) {
        listAllFileRef.items.forEach(async (itemRef) => deleteObject(itemRef));
      }
      const promises = Object.keys(files).map(async (key) => {
        const storageRef = ref(
          storage,
          `manga/${mangaId}/chapters/${chapterId}/${key}`
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
      const updateThumbUrlMangaRes = await Chapter.updateOne(
        { _id: chapterId },
        { $set: { listImgUrl: listPublicUrl } }
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

// @route GET api/chapter/:id/img
// @desc Get all chapter's images
// @access Public
router.get("/:id/imgs", async (req, res) => {
  const { id } = req.params;
  try {
    const chapter = await Chapter.findOne({ _id: id }).populate(
      "mangaId",
      "name chapters"
    );
    if (!chapter) {
      return res.status(400).json({
        success: false,
        message: "Couldn't find this chapter",
      });
    }
    res.json({ success: true, data: chapter });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
// @route PUT api/chapter
// @desc Update manga chapter
// @access Private
router.put("/:id", verifyToken, async (req, res) => {
  if (req.user.role !== ROLE.ADMIN) {
    return res.status(401).json({
      success: false,
      message: "You don't have permission to update this chapter",
    });
  }
  const chapterId = req.params.id;
  const { title, listThumbUrl } = req.body;
  if (!chapterId || !title) {
    return res.status(400).json({
      success: false,
      message: "Chapter's manga id and chapter's title are required",
    });
  }
  try {
    const chapterUpdateCondition = { _id: chapterId };
    let updateChapter = {
      title,
      listThumbUrl: listThumbUrl || [],
    };
    updateChapter = await Chapter.findOneAndUpdate(
      chapterUpdateCondition,
      updateChapter,
      { new: true }
    );
    if (!updateChapter) {
      return res.status(401).json({
        success: false,
        message: "Chapter not found or user not authorized",
      });
    }
    res.json({
      success: true,
      message: "Create chapter successfully",
      chapter: updateChapter,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route DELETE api/chapter
// @desc Delete chapter
// @access Private
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const chapterDeleteCondition = { _id: req.params.id };
    const deletedChapter = await Chapter.findOneAndDelete(
      chapterDeleteCondition
    );
    // User not authorized or chapter not found
    if (!deletedChapter) {
      return res.status(401).json({
        success: false,
        message: "Chapter not found or user not authorized",
      });
    }
    const mangaId = deletedChapter.mangaId;
    await Manga.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { chapters: mangaId } }
    );
    res.json({
      success: true,
      message: "Delete chapter successfully",
      post: deletedChapter,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
