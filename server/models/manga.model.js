const Manga = require("../models/manga");
const getMore = async (
  conditions,
  page = 0,
  limit = DEFAULT_LIMIT,
  selections = "_id",
  sort = { _id: -1 }
) => {
  if (page < 0 || limit <= 0) {
    return null;
  }
  const options = {
    populate: "genres",
    page,
    limit,
    select: selections,
    sort,
  };
  const mangas = await Manga.paginate(conditions, options);
  return mangas;
};
module.exports = { getMore };
