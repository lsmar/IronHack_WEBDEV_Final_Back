require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors')

const app = express();

// const authBasic = require("./auth/authBasic");
//const canAccess = require("./auth/authController").hasRole;
// checkUser = function(role) {
//   return [authBasic.decodeToken(), authBasic.getFreshUser(), canAccess(role)];
// };

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

app.use(cors());

//* Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//* Initialize passport for social login
// app.use(passport.initialize());

//* Google login
// const googleStrategy = require("./auth/authGoogle");
// passport.use(googleStrategy);

//* FaceBook
// const facebookStrategy = require("./auth/authFacebook");
// passport.use(facebookStrategy);

//* Social Login Routes
// app.use("/auth", require("./auth/authSocialRoutes"));

//* Auth Routes
const authRoutes = require("./auth/authRoutes");
app.use("/auth", authRoutes);

//* User Routes
const userRoutes = require("./api/user/userRoutes");
app.use("/user", userRoutes);

//* Project Routes
const projectRoutes = require("./api/project/projectRoutes");
app.use("/project", projectRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Listening on http://localhost:${process.env.PORT}`);
});
