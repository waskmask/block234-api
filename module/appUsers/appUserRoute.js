const appUserController = require("./appUserController");
const middleware = require("../../middleware");
// const { uploader } = require("../../utils/fileUploader");
// const { excelUploader } = require("../../utils/excelUploader");

module.exports = (router) => {
  router.post(
    "/artist/login",
    middleware.validateToken,
    appUserController.artistLogin
  );
  router.post("/loginUser", appUserController.artistLogin);
  router.post("/appUser/forgot-password", appUserController.forgotPassword);
  router.post("/appUser/reset-password", appUserController.resetPassword);
  router.post("/appUser/verification-code", appUserController.verificationCode);

  router.post("/registerUser", appUserController.addappUser);
  router.post(
    "/update/appUserSpecificColumn",
    middleware.validateToken,
    appUserController.updateappUserSpecificColumn
  );
  router.patch(
    "/update/appUser",
    middleware.validateToken,
    appUserController.updateappUser
  );
  router.get(
    "/all/appUser",
    middleware.validateToken,
    appUserController.getAllappUser
  );
  router.get(
    "/all/appArtists",
    middleware.validateToken,
    appUserController.getAllappArtists
  );
  router.get(
    "/appUser/:id",
    middleware.validateToken,
    appUserController.getappUser
  );
  router.get(
    "/getappUserProfile",
    middleware.validateToken,
    appUserController.getappUserProfile
  );
  router.post(
    "/remove/appUser",
    middleware.validateToken,
    appUserController.deleteappUser
  );
};
