const appUserRoute = require("../module/appUsers/appUserRoute");
const coinPriceRoute = require("../module/coinPrice/coinPriceRoute");
const blogsRoute = require("../module/blogs/blogRoute");
const blogCategoryRoute = require("../module/blogCategory/blogCategoryRoute");

module.exports = (router) => {
  appUserRoute(router);
  coinPriceRoute(router);
  blogsRoute(router);
  blogCategoryRoute(router);

  return router;
};
