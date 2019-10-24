const router = require("express").Router();
const passport = require("passport");
const getToken = require("./authBasic").getNewJwt;

router.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"]
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/"
  }),
  getToken,
  (req, res, next) => {
    res.status(200).cookie("access_token", "Bearer " + req.jwtToken, {
      signed: true,
      expires: new Date(Date.now() + 24 * 3600000) //* Cookie will be removed after 24 hours
    });
    if (typeof req.cookies.app != "undefined") res.redirect("/dash");
    else res.json({ token: req.jwtToken });
  }
);

router.get("/facebook", passport.authenticate("facebook", { scope: "email", session: false }));

router.get("/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login", session: false }), getToken, (req, res, next) => {
  res.status(200).cookie("access_token", "Bearer " + req.jwtToken, {
    signed: true,
    expires: new Date(Date.now() + 24 * 3600000) //* Cookie will be removed after 24 hours
  });
  if (typeof req.cookies.app != "undefined") res.redirect("/dash");
  else res.json({ token: req.jwtToken });
});

module.exports = router;
