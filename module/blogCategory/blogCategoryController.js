const blogCategoryService = require("./blogCategoryService");
const helper = require("../../utils/helper");
const createHttpError = require("http-errors");
const {
  validateAddblogReq,
  validateUpdateblogReq,
} = require("./blogCategoryValidation");

const addblogCategory = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        createHttpError(400, { message: "Please pass body parameters" })
      );
    }
    let isValid = await validateAddblogReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await blogCategoryService.addblogCategory(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};

const updateblogCategory = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        createHttpError(400, { message: "Please pass body parameters" })
      );
    }
    let isValid = await validateUpdateblogReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await blogCategoryService.updateblogCategory(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};

const getAllblogCategory = async (req, res, next) => {
  try {
    let result = await blogCategoryService.getAllblogCategory(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

const getblogCategory = async (req, res, next) => {
  try {
    if (
      !req.params.id ||
      Object.keys(req.params).length === 0 ||
      req.params.id == "undefined"
    ) {
      return next(createHttpError(400, { message: "Please pass id" }));
    }
    let result = await blogCategoryService.getblogCategory(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

const deleteblogCategory = async (req, res, next) => {
  try {
    if (
      !req.params.id ||
      Object.keys(req.params).length === 0 ||
      req.params.id == "undefined"
    ) {
      return next(createHttpError(400, { message: "Please pass id" }));
    }
    let result = await blogCategoryService.deleteblogCategory(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addblogCategory,
  updateblogCategory,
  getAllblogCategory,
  getblogCategory,
  deleteblogCategory,
};
