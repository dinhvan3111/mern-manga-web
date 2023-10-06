const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChapterSchema = new Schema({
  title: {
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
  listImgUrl: [{ type: String }],
});

module.exports = mongoose.model("chapters", ChapterSchema);
