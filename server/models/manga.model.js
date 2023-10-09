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
  const mangas = await Manga.paginate(conditions, {
    page,
    limit,
    select: selections,
    sort,
  });
  return mangas;
};
module.exports = { getMore };
