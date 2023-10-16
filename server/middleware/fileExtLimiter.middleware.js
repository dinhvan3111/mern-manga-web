const path = require("path");

const fileExtLimiter = (allowedExtArray) => {
  return (req, res, next) => {
    const files = req.files;
    const fileExtensions = [];
    Object.keys(files).forEach((key) => {
      fileExtensions.push(path.extname(files[key].name));
    });

    // Determine if the file extensions are allowed
    const allowed = fileExtensions.every((ext) =>
      allowedExtArray.includes(ext)
    );

    if (!allowed) {
      const message = `Upload failed. Only ${allowedExtArray.join(
        ", "
      )} files allowed`;
      return res.status(422).json({ status: "error", message });
    }
    console.log("Passed");
    next();
  };
};

module.exports = fileExtLimiter;