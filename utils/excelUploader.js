var multer = require("multer");
var path = require("path");
const createHttpError = require("http-errors");

const admin_excel_dir = path.join(__dirname, "../public/userExcelUpload");

const allowed_formats = [".xlsx", ".xls"]; // Allow Excel file formats

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dirname = admin_excel_dir;
    cb(null, dirname);
  },

  filename: (req, file, cb) => {
    let filename = "excel_" + Date.now() + path.extname(file.originalname); // Prefixing filename with 'excel_'
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  if (allowed_formats.includes(path.extname(file.originalname))) {
    cb(null, true);
  } else {
    return cb(
      createHttpError(400, {
        message: "Only Excel files (xlsx, xls) are allowed",
      })
    );
  }
};

const excelUploader = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = {
  excelUploader,
};
