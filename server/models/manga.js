const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MangaSchema = new Schema({
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  artists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
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
    type: String,
    enum: ["ON GOING", "COMPLETED", "ABANDONED"],
  },
  rating: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("mangas", MangaSchema);
