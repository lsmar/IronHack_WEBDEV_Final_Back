const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require("../api/user/userModel");

module.exports = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "/auth/google/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    const userObj = { name: profile._json.name, email: profile._json.email, googleID: profile._json.sub, thumbnail: profile._json.picture };
    userModel
      .findOne({ email: userObj.email })
      .then(user => {
        if (user) {
          if (typeof user.googleID === "undefined") {
            const updateUser = { googleID: userObj.googleID };
            if (typeof user.thumbnail === "undefined") updateUser.thumbnail = userObj.thumbnail;
            user
              .updateOne(updateUser)
              .then(user => done(null, user))
              .catch(err => done(err));
          } else {
            done(null, user);
            return;
          }
        }
        new userModel(userObj)
          .save()
          .then(newUser => {
            done(null, newUser);
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  }
);
