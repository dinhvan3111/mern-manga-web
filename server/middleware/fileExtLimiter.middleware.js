const path = require("path");

const fileExtLimiter = (allowedExtArray) => {
  return (req, res, next) => {
    const files = req.files;
    const fileExtensions = [];
    Object.keys(files).forEach((key) => {
      const fileOrFiles = files[key];

      // handle array (multiple files same key) or single file
      const fileArray = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
      fileArray.forEach((file) => {
        const filename = file?.name;
        if (typeof filename === "string") {
          fileExtensions.push(path.extname(filename));
        }
      });
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
    next();
  };
};

module.exports = fileExtLimiter;
