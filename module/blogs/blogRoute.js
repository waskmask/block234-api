const blogController = require("./blogController");
const middleware = require("../../middleware");
const { uploader } = require("../../utils/fileUploader");

module.exports = (router) => {
  router.post("/add/blog", middleware.validateToken, blogController.addBlog);
  router.post(
    "/update/blog",
    middleware.validateToken,
    blogController.updateblog
  );
  router.post("/all/blog", blogController.getAllblog);
  router.get("/blog/:slug", blogController.getblog);
  router.post(
    "/remove/blog/:id",
    middleware.validateToken,
    blogController.deleteblog
  );
  router.post(
    "/upload/media",
    middleware.validateToken,
    uploader.single("media"),
    blogController.uploadMedia
  );
};
