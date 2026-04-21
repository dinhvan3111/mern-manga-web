// services/chapterService.js
const Chapter        = require("../models/chapter");
const Manga          = require("../models/manga");
const StorageContainer = require("./storages/StorageContainer");

const storageService = StorageContainer.resolve();

const deleteChapter = async (chapterId) => {
    // Step 1 — find chapter
    const chapter = await Chapter.findOne({ _id: chapterId });
    if (!chapter) {
    return { success: false, message: "Chapter not found" };
    }

    const mangaId = chapter.mangaId;

    // Step 2 — delete images from storage first
    const chapterFolderPath = `manga/${mangaId}/chapters/${chapterId}`;
    await storageService.deleteFolder(chapterFolderPath);

    // Step 3 — delete chapter from DB
    const deletedChapter = await Chapter.findOneAndDelete({ _id: chapterId });

    // Step 4 — remove chapter reference from manga
    await Manga.findOneAndUpdate(
    { _id: mangaId },
    { $pull: { chapters: chapterId } }
    );

    return { success: true, data: deletedChapter };
}

module.exports = { deleteChapter };