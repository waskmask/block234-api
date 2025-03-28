const appUserController = require("./appUserController");
const middleware = require("../../middleware");
const { uploader } = require("../../utils/fileUploader");

module.exports = (router) => {
  router.post(
    "/artist/login",
    middleware.validateToken,
    appUserController.artistLogin
  );
  router.post("/loginUser", appUserController.artistLogin);
  router.post("/appUser/forgot-password", appUserController.forgotPassword);
  router.post("/appUser/reset-password", appUserController.resetPassword);
  router.post("/appUser/verify-email", appUserController.verificationCode);

  router.post("/registerUser", appUserController.addappUser);
  router.post(
    "/update/appUserSpecificColumn",
    middleware.validateToken,
    appUserController.updateappUserSpecificColumn
  );
  router.put(
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
    "/upload/profile-image",
    middleware.validateToken,
    uploader.single("profileImage"),
    appUserController.uploadProfileImage
  );
  router.post(
    "/delete/profile-image",
    middleware.validateToken,
    appUserController.removeProfileImage
  );
  router.post(
    "/check-username/:username",
    middleware.validateToken,
    appUserController.checkUsername
  );
};
