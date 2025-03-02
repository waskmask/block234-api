const coinPriceService = require("./coinPriceService");
const helper = require("../../utils/helper");
const createHttpError = require("http-errors");
const {
  validateAddCoinPriceReq,
  validateUpdateCoinPriceReq,
} = require("./coinPriceValidation");

const addCoinPrice = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        createHttpError(400, { message: "Please pass body parameters" })
      );
    }
    let isValid = await validateAddCoinPriceReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await coinPriceService.addCoinPrice(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};

const updateCoinPrice = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        createHttpError(400, { message: "Please pass body parameters" })
      );
    }
    let isValid = await validateUpdateCoinPriceReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await coinPriceService.updateCoinPrice(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};

const getAllCoinPrice = async (req, res, next) => {
  try {
    let result = await coinPriceService.getAllCoinPrice(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

const top10coins = async (req, res, next) => {
  try {
    let result = await coinPriceService.top10coins(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

const getCoinPrice = async (req, res, next) => {
  try {
    let result = await coinPriceService.getCoinPrice(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

const deleteCoinPrice = async (req, res, next) => {
  try {
    let result = await coinPriceService.deleteCoinPrice(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

const saveCoinPrice = async (req, res, next) => {
  try {
    let result = await coinPriceService.saveCoinPrice(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

const getTodayVotedCoin = async (req, res, next) => {
  try {
    let result = await coinPriceService.getTodayVotedCoin(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

const getAllUserVotedCoins = async (req, res, next) => {
  try {
    let result = await coinPriceService.getAllUserVotedCoins(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addCoinPrice,
  updateCoinPrice,
  getAllCoinPrice,
  getCoinPrice,
  deleteCoinPrice,
  top10coins,
  saveCoinPrice,
  getTodayVotedCoin,
  getAllUserVotedCoins,
};
