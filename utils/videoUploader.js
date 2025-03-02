const multer = require("multer");
const path = require("path");
const createHttpError = require("http-errors");

const video_dir = path.join(__dirname, "../public/mediaVideo"); // Add a directory for video uploads

const allowed_video_formats = [
  ".mp4",
  ".MP4",
  ".mov",
  ".MOV",
  ".webm",
  ".WEBM",
]; // Add more video formats as needed

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dirname = video_dir;

    // Handle different paths for different file types
    if (req.path === "/add/MediaPost") {
      dirname = video_dir;
    }

    cb(null, dirname);
  },

  filename: (req, file, cb) => {
    let filename =
      file.fieldname + "_" + Date.now() + path.extname(file.originalname);
    filename = Date.now() + path.extname(file.originalname);
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  // Check the file format based on the path
  let allowed_formats = [];
  if (req.path === "/add/MediaPost") {
    allowed_formats = allowed_video_formats;
  } else if (req.path === "/upload/MediaVideo") {
    allowed_formats = allowed_video_formats;
  }

  if (allowed_formats.includes(path.extname(file.originalname))) {
    cb(null, true);
  } else {
    return cb(
      createHttpError(400, {
        message: "Only " + allowed_formats.join(", ") + " are allowed",
      })
    );
  }
};

const videoUploader = multer({
  // storage: storage,
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
  limits: {
    fileSize: 2048 * 1024 * 1024,
  },
});

module.exports = {
  videoUploader,
};
