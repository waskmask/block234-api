const blogCategoryController = require("./blogCategoryController");
const tokenValidator = require("../../middleware/index");

module.exports = (router) => {
  router.post(
    "/add/blog-category",
    tokenValidator.validateToken,
    blogCategoryController.addblogCategory
  );
  router.put(
    "/update/blog-category",
    tokenValidator.validateToken,
    blogCategoryController.updateblogCategory
  );
  router.get("/all/blog-category", blogCategoryController.getAllblogCategory);
  router.get("/blog-category/:id", blogCategoryController.getblogCategory);
  router.post(
    "/remove/blog-category/:id",
    tokenValidator.validateToken,
    blogCategoryController.deleteblogCategory
  );
};
