const MB = 5;
const FILE_SIZE_LIMIT = MB * 1024 * 1024;

const fileSizeLimiter = (req, res, next) => {
  const files = req.files;
  const filesOverLimit = [];
  // Determine which files are over the limit
  Object.keys(files).forEach((key) => {
    if (files[key].size > FILE_SIZE_LIMIT) {
      filesOverLimit.push(files[key].name);
    }
  });

  if (filesOverLimit.length) {
    const properVerb = filesOverLimit.length > 1 ? "are" : "is";
    const sentence = `Upload failed. ${filesOverLimit.join(
      ", "
    )} ${properVerb} over the limit`;

    // const message = filesOverLimit.length < 3;
    res.status(413).json({ status: false, message: sentence });
  }
  next();
};

module.exports = fileSizeLimiter;
