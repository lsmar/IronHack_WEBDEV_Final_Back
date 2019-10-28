const router = require("express").Router();
const controller = require("./recordBookController");
const auth = require("../../auth/authBasic");
const canAccess = require("../../auth/authController").hasRole;

checkUser = function(role) {
  return [auth.decodeToken(), auth.getFreshUser(), canAccess(role)];
};

//* Get id from routes
router.param("id", controller.paramId);
router.param("date", controller.paramProjectDate);
router.param("idProject", controller.paramIdProject);

//* Get All from my institution
router.get("/", checkUser(), controller.getAll);

//* Get All from one project with or without date
router.get("/project/:idProject/:date?", checkUser(), controller.getAllFromProject);

//* Create All for students in that project in a day
router.post("/all", checkUser(), controller.createAll);

//* Get One
router.get("/:id", checkUser(), controller.getOne);

//* Edit One
router.put("/:id", checkUser(), controller.editOne);
router.patch("/:id", checkUser(), controller.editOne);

//* Delete One
router.delete("/:id", checkUser(), controller.deleteOne);

module.exports = router;
