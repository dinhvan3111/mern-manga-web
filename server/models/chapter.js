const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const paginate = require("mongoose-paginate-v2");

const ChapterSchema = new Schema(
  {
    mangaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "mangas",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    listImgUrl: [{ type: String }],
    publishDate: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);
ChapterSchema.plugin(paginate);
module.exports = mongoose.model("chapters", ChapterSchema);
