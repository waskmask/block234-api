const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const monthYear = new Date()
      .toLocaleString("en-us", { month: "2-digit", year: "numeric" })
      .replace("/", "-");

    // Determine the subfolder based on file type
    let subFolder;
    if (file.mimetype.startsWith("image/")) {
      subFolder = "images";
    } else if (file.mimetype.startsWith("video/")) {
      subFolder = "videos";
    } else {
      return cb(new Error("Unsupported file type"), null);
    }

    // Create the destination directory
    const dir = path.join(__dirname, "..", "uploads", monthYear, subFolder);

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
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "video/mp4",
      "video/mpeg",
      "video/quicktime", // .mov files
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG, MP4, MPEG, and MOV files are allowed."
        ),
        false
      );
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for videos
  },
});

module.exports = {
  uploader,
};
