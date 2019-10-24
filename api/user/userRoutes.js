const router = require("express").Router();
const controller = require("./userController");
const auth = require("../../auth/authBasic");
const canAccess = require("../../auth/authController").hasRole;

checkUser = function(role) {
  return [auth.decodeToken(), auth.getFreshUser(), canAccess(role)];
};

//* Get id from routes
router.param("id", controller.paramId);

router.post("/edit/:id", checkUser(), controller.edit);

router.get("/logout", (req, res, next) => {});

// router.post("/signUp", controller.signUp);

module.exports = router;
