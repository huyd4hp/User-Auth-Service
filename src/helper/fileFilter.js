fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
    cb(null, true); // Chấp nhận file
  } else {
    cb(new Error("Only PNG and JPG images are allowed"), false); // Từ chối file
  }
};

module.exports = fileFilter;
