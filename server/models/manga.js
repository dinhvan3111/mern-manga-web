const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const paginate = require("mongoose-paginate-v2");

const MangaSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbUrl: {
      type: String,
    },
    chapters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chapters",
      },
    ],
    genres: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "genres",
      },
    ],
    authors: [
      {
        type: String,
      },
    ],
    artists: [
      {
        type: String,
      },
    ],
    transTeam: {
      type: String,
    },
    latestUpdate: {
      type: Date,
      default: Date.now,
    },
    addedAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    status: {
      type: Number,
      enum: [0, 1, 2],
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { versionKey: false }
);
MangaSchema.index({ name: "text", description: "text" });
MangaSchema.plugin(paginate);
module.exports = mongoose.model("mangas", MangaSchema);
