const coinPriceController = require("./coinPriceController");
const middleware = require("../../middleware");

module.exports = (router) => {
  router.post(
    "/add/coinPrice",
    middleware.validateToken,
    coinPriceController.addCoinPrice
  );
  router.put(
    "/update/coinPrice",
    middleware.validateToken,
    coinPriceController.updateCoinPrice
  );
  router.get("/all/coinPrice", coinPriceController.getAllCoinPrice);
  router.get("/top10coins", coinPriceController.top10coins);
  router.get("/coinPrice/:id", coinPriceController.getCoinPrice);
  router.post("/remove/coinPrice/:id", coinPriceController.deleteCoinPrice);
  router.post(
    "/save/coinPrice/:id",
    middleware.validateToken,
    coinPriceController.saveCoinPrice
  );
  router.get(
    "/getTodayVotedCoin",
    middleware.validateToken,
    coinPriceController.getTodayVotedCoin
  );
  router.get(
    "/getAllUserVotedCoins",
    middleware.validateToken,
    coinPriceController.getAllUserVotedCoins
  );
};
