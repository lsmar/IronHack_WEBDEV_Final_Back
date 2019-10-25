const router = require("express").Router();
const controller = require("./projectController");
const auth = require("../../auth/authBasic");
const canAccess = require("../../auth/authController").hasRole;

checkUser = function(role) {
  return [auth.decodeToken(), auth.getFreshUser(), canAccess(role)];
};

//* Get id from routes
router.param("id", controller.paramId);  //can get project id?

//* Get All
router.get("/", checkUser(), controller.getAll);

//* Get teacher`s projects
router.get("/my", checkUser(), controller.getMy);

//* Create One
router.post("/", controller.createOne);
// router.post("/", checkUser(), controller.createOne);


//* Get One
router.get("/:id", checkUser(), controller.getOne);

//* Edit One
router.put("/:id", checkUser(), controller.editOne);
router.patch("/:id", checkUser(), controller.editOne);

//* Delete One
router.delete("/:id", checkUser("COORDINATOR"), controller.deleteOne);

module.exports = router;
