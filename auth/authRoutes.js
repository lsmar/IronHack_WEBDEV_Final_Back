const router = require("express").Router();
const { verifyUser, decodeToken, getFreshUser } = require("./authBasic");
const controller = require("./authController");

router.post("/login", verifyUser(), controller.signin);

router.post("/signup", controller.signup);

router.get("/check", decodeToken(), getFreshUser(), (req, res) => res.json({ token: true }));

module.exports = router;
