const router = require("express").Router();
const controller = require("./companyController");
const auth = require("../../auth/authBasic");
const canAccess = require("../../auth/authController").hasRole;
const uploadCloud = require("../../config/cloudinary");

checkUser = function(role) {
  return [auth.decodeToken(), auth.getFreshUser(), canAccess(role)];
};

//* Get id from routes
router.param("id", controller.paramId);

//* New company
router.post("/", checkUser(""), uploadCloud.single("photo"), controller.newCompany);

router.get("/editview/new", checkUser(""), controller.newCompanyView);
router.get("/editview/:id", checkUser(""), controller.editCompanyView);

//* Get all companys
router.get("/", controller.getAllCompany);

// //* Get one companys
router.get("/:id", controller.getOneCompany);

// //* Edit company
router.post("/:id", checkUser(""), controller.editCompany);
router.put("/:id", checkUser(""), controller.editCompany);
router.patch("/:id", checkUser(""), controller.editCompany);

// //* Delete company
router.delete("/:id", controller.removeCompany);

module.exports = router;
