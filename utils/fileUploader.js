const multer = require("multer");
const path = require("path");
const fs = require("fs");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const monthYear = new Date()
      .toLocaleString("en-us", { month: "2-digit", year: "numeric" })
      .replace("/", "-");

    const dir = path.join(__dirname, "..", "uploads", monthYear, "images");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const fileExt = path.extname(file.originalname);
    const filename = `${timestamp}${fileExt}`;
    cb(null, filename);
  },
});

// Multer single file upload middleware
const uploader = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
});

module.exports = {
  uploader,
};
