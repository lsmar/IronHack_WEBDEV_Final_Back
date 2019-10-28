const router = require("express").Router();
const controller = require("./recordBookController");
const auth = require("../../auth/authBasic");
const canAccess = require("../../auth/authController").hasRole;

checkUser = function(role) {
  return [auth.decodeToken(), auth.getFreshUser(), canAccess(role)];
};

//* Get id from routes
router.param("id", controller.paramId);
router.param("date", (req, res, next, date) => {
  req.date = date;
  next();
});
router.param("idStudent", (req, res, next, idStudent) => {
  req.idStudent = idStudent;
  next();
});
router.param("projectId", (req, res, next, projectId) => {
  req.projectId = projectId;
  next();
});
router.param("idProject", (req, res, next, idProject) => {
  req.idProject = idProject;
  next();
});

//* Get All from my institution
router.get("/", checkUser(), controller.getAll);

//* Get All from one project with or without date
router.get("/project/:idProject/:date?", checkUser(), controller.getAllFromProjectOrFromStudent);

//* Get All from one student with or without project and with or without date
router.get("/student/:idStudent/:idProject?/:date?", checkUser(), controller.getAllFromProjectOrFromStudent);

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
