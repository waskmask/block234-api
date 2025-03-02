var multer = require("multer");
var path = require("path");
const createHttpError = require("http-errors");

const admin_image_dir = path.join(__dirname, "../public/adminImage");
const artist_category_icon_dir = path.join(
  __dirname,
  "../public/artistCategoryIcon"
);
const badge_icon_dir = path.join(__dirname, "../public/badgeIcon");
const coin_price_icon_dir = path.join(__dirname, "../public/coinPriceIcon");
const concert_icon_dir = path.join(__dirname, "../public/concertTypeIcon");
const profile_cover_dir = path.join(__dirname, "../public/profileCoverImage");

const allowed_formats = [".jpg", ".jpeg", ".png"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dirname = admin_image_dir;
    if (req.path === "/add/admin") {
      dirname = admin_image_dir;
    }
    if (req.path === "/upload/profile-cover-image") {
      dirname = profile_cover_dir;
    }
    if (req.path === "/add/gallery") {
      dirname = profile_cover_dir;
    }
    if (req.path === "/add/artist-category") {
      dirname = artist_category_icon_dir;
    }
    if (req.path === "/add/badge") {
      dirname = badge_icon_dir;
    }
    if (req.path === "/add/coinPrice") {
      dirname = coin_price_icon_dir;
    }
    if (req.path === "/add/concertType") {
      dirname = concert_icon_dir;
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
  if (allowed_formats.includes(path.extname(file.originalname))) {
    cb(null, true);
  } else {
    return cb(
      createHttpError(400, { message: "Only jpeg, jpg, png are allowed" })
    );
  }
};

const uploader = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = {
  uploader,
};
