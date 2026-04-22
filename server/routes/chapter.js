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
const getCurrentDateTime = require("../utils/timeUtils");
const chapter = require("../models/chapter");
const StorageContainer = require("../services/storages/StorageContainer");
const { randomUUID } = require("crypto"); 
const { deleteChapter } = require("../services/chapterService");


const storageService = StorageContainer.resolve();

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
  // Check if user is not admin
  if (req.user.role !== ROLE.ADMIN) {
    return res.status(401).json({
      success: false,
      message: "You don't have permission to update this manga",
    });
  }
  const { mangaId, title, listImgUrl } = req.body;
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
      listImgUrl: listImgUrl || [],
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

// @route PUT api/chapter/:id/uploadListImgs
// @desc Upload or update chapter's images
// @access Private
router.put(
  "/:id/uploadListImgs",
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

    try {
      const chapterId = req.params.id;
      const chapter   = await Chapter.findOne({ _id: chapterId });

      if (!chapter) {
        return res.status(404).json({
          success: false,
          message: "Couldn't find this chapter",
        });
      }

      const mangaId      = chapter.mangaId;
      const oldImageUrls = chapter.listImgUrl || [];  // empty on first upload
      const newFiles     = req.files || {};
      const orderedImages = JSON.parse(req.body.orderedImages || "[]");

      // Step 1 — find images to delete
      // first upload: oldImageUrls = [] → skips this entirely
      const keptUrls = orderedImages
        .filter((img) => img.type === "existing")
        .map((img) => img.file);

      const toDelete = oldImageUrls.filter((url) => !keptUrls.includes(url));

      if (toDelete.length) {
        await Promise.all(
          toDelete.map((url) => storageService.delete(url))
        );
      }

      // Step 2 — upload new files
      const uploadedMap = {};  // { originalname: uploadedUrl }

        const uploadPromises = Object.keys(newFiles).flatMap((key) => {
        const fileOrFiles = newFiles[key];
        const fileArray = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
        return fileArray.map(async (fileOg) => {
          // TODO: if file count is not equal to type"new" count in orderedImages → return error
          const file = {
            buffer:       fileOg.data,
            mimetype:     fileOg.mimetype,
            originalname: `${chapterId}_${randomUUID()}`,
          };
          const destination = `manga/${mangaId}/chapters/${chapterId}`;
          const url = await storageService.upload(file, destination);
          uploadedMap[fileOg.name] = url;
        });
      });

      await Promise.all(uploadPromises);

      // Step 3 — build final ordered list
      const finalImageUrls = orderedImages.length
        // update: follow orderedImages positions
        ? orderedImages.map((img) => {
            if (img.type === "existing") return img.file;
            if (img.type === "new")      return uploadedMap[img.file];
          })
        // first upload: no orderedImages → just use uploaded urls
        : Object.values(uploadedMap);

      // Step 4 — save final ordered list to DB ✅ (was missing before!)
      const updatedChapter = await Chapter.findOneAndUpdate(
        { _id: chapterId },
        { $set: { listImgUrl: finalImageUrls } },
        { new: true }
      );

      res.json({
        success: true,
        message: "Chapter images updated successfully",
        data: {
          chapter:     updatedChapter,
          listImgUrl:  finalImageUrls,
        },
      });

    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
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
  const { title, listImgUrl } = req.body;
  if (!chapterId || !title) {
    return res.status(400).json({
      success: false,
      message: "Chapter's manga id and chapter's title are required",
    });
  }
  const chapter = await Chapter.findOne({ _id: chapterId });
  if (!chapter) {
    return res.status(400).json({
      success: false,
      message: "Couldn't find this chapter",
    });
  }

  try {
    const chapterUpdateCondition = { _id: chapterId };
    let updateChapter = {
      title: title || chapter.title,
      listImgUrl: chapter.listImgUrl,
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
      message: "Update chapter successfully",
      data: { chapter: updateChapter },
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
  // Check if user is not admin
  if (req.user.role !== ROLE.ADMIN) {
    return res.status(401).json({
      success: false,
      message: "You don't have permission to delete this chapter",
    });
  }
  try {
    const chapterId = req.params.id;
    const result = await deleteChapter(chapterId);
    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json({
      success: true,
      message: "Delete chapter successfully",
      data: result.data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
