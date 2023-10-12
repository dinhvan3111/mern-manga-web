const filePayloadExists = (req, res, next) => {
  if (!req.files)
    return res.status(400).json({ success: false, message: "Missing files" });

  next();
};

module.exports = filePayloadExists;
