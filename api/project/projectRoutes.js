const router = require("express").Router();
const controller = require("./projectController");
const auth = require("../../auth/authBasic");
const canAccess = require("../../auth/authController").hasRole;
const uploadCloud = require("../../config/cloudinaryProjects");
const checkInstitution = require("./projectController").checkIfFromThisInstitution;

checkUser = function(role) {
  return [auth.decodeToken(), auth.getFreshUser(), canAccess(role)];
};

//* Get id from routes
router.param("id", controller.paramId);

//* Get All
router.get("/", checkUser(), controller.getAll);

//* Get teacher`s projects
router.get("/my", checkUser(), controller.getMy);

//* Create One
router.post("/", checkUser(), uploadCloud.single("image"), controller.createOne);

//* Get One
router.get("/:id", checkUser(), checkInstitution, controller.getOne);

//* Edit One
router.put("/:id", checkUser(), checkInstitution, controller.editOne);
router.patch("/:id", checkUser(), checkInstitution, controller.editOne);

//* Delete One
router.delete("/:id", checkUser("COORDINATOR"), checkInstitution, controller.deleteOne);

module.exports = router;
