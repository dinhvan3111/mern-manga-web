const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GenreSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("genres", GenreSchema);
