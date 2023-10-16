const Chapter = require("../models/chapter");
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
    page,
    limit,
    select: selections,
    sort,
  };
  const chapters = await Chapter.paginate(conditions, options);
  return chapters;
};
module.exports = { getMore };
