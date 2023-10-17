const FavouriteManga = require("../models/favouriteManga");
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
    populate: {
      path: "manga",
      populate: {
        path: "genres",
      },
      options: { sort: { publishDate: -1 } },
    },
    page,
    limit,
    select: selections,
    sort,
  };
  const chapters = await FavouriteManga.paginate(conditions, options);
  return chapters;
};
module.exports = { getMore };
