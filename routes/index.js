
const appUserRoute = require("../module/appUsers/appUserRoute");
const coinPriceRoute = require("../module/coinPrice/coinPriceRoute");

module.exports = (router) => {
  
  appUserRoute(router);
  coinPriceRoute(router);
  

  return router;
};
