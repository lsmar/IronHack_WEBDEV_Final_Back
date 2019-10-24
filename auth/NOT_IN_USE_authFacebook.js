const FacebookStrategy = require("passport-facebook").Strategy;
const userModel = require("../api/user/userModel");

module.exports = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ["emails", "picture.type(large)", "name", "displayName"]
  },
  function(accessToken, refreshToken, profile, done) {
    const userObj = {
      name: profile._json.name,
      email: profile._json.email,
      facebookID: profile._json.id,
      thumbnail: profile._json.picture.data.url
    };
    userModel
      .findOne({ email: userObj.email })
      .then(user => {
        if (user) {
          if (typeof user.facebookID === "undefined") {
            const updateUser = { facebookID: userObj.facebookID };
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
