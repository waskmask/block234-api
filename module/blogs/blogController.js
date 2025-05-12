const blogService = require("./blogService");
const helper = require("../../utils/helper");
const createHttpError = require("http-errors");
const {
  validateAddBlogReq,
  validateUpdateBlogReq,
  validateUploadMediaReq,
} = require("./blogValidation");

const addBlog = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        createHttpError(400, { message: "Please pass body parameters" })
      );
    }
    let isValid = await validateAddBlogReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await blogService.addBlog(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};

const updateblog = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        createHttpError(400, { message: "Please pass body parameters" })
      );
    }
    let isValid = await validateUpdateBlogReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await blogService.updateblog(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};

const getAllblog = async (req, res, next) => {
  try {
    let result = await blogService.getAllblog(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

const getblog = async (req, res, next) => {
  try {
    let result = await blogService.getblog(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

const deleteblog = async (req, res, next) => {
  try {
    let result = await blogService.deleteblog(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

const uploadMedia = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        createHttpError(400, { message: "Please pass body parameters" })
      );
    }
    let isValid = await validateUploadMediaReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await blogService.uploadMedia(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};

module.exports = {
  addBlog,
  updateblog,
  getAllblog,
  getblog,
  deleteblog,
  uploadMedia,
};
