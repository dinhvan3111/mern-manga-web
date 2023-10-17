const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const paginate = require("mongoose-paginate-v2");

const FavouriteMangaSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    manga: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "mangas",
      required: true,
    },
  },
  { versionKey: false }
);
FavouriteMangaSchema.plugin(paginate);
module.exports = mongoose.model("favourites", FavouriteMangaSchema);
