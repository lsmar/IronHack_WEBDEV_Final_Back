const router = require("express").Router();
const controller = require("./userController");
const auth = require("../../auth/authBasic");
const canAccess = require("../../auth/authController").hasRole;

checkUser = function(role) {
  return [auth.decodeToken(), auth.getFreshUser(), canAccess(role)];
};

//* Get id from routes
router.param("id", controller.paramId);

//* Get me
router.get("/me", checkUser(), controller.getMe);

//* Change password
router.post("/changePass", checkUser(), controller.changePass);

//* Get All
router.get("/", checkUser(), controller.getAll);

//* Create One
router.post("/", checkUser(), controller.createOne);

//* Get One
router.get("/:id", checkUser(), controller.getOne);

//* Edit One
router.put("/:id", checkUser(), controller.editOne);
router.patch("/:id", checkUser(), controller.editOne);

//* Delete One
router.delete("/:id", checkUser(), controller.deleteOne);

module.exports = router;
