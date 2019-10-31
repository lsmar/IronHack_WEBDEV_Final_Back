const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const checkToken = expressJwt({ secret: process.env.SECRET_JWT });
const User = require("../api/user/userModel");

exports.decodeToken = () => {
  return [
    (req, res, next) => {
      //* Decodificar o token
      //* Verifica se tem o access_token na query (url) caso exista: inclui o headers authorization
      if (req.query && req.query.hasOwnProperty("access_token")) {
        req.headers.authorization = req.query.access_token;
      } else if (req.signedCookies && typeof req.signedCookies.access_token !== "undefined") {
        req.headers.authorization = req.signedCookies.access_token;
      }
      if (typeof req.headers.authorization != "undefined" && req.headers.authorization.indexOf("Bearer ") < 0) {
        req.headers.authorization = "Bearer " + req.headers.authorization;
      }
      //* Verifica se o token é valido, se for chama next() se não for retorna erro.
      checkToken(req, res, next);
    }
  ];
};

exports.getFreshUser = () => {
  //* The token is valid let's include the user data to req
  return (req, res, next) => {
    User.findById(req.user._id)
    .then(
      user => {
        if (!user) {
          res.status(401).json({
            error: "Unauthorized User, userId: " + req.user._id
          });
        } else {
          req.user = user;
          next();
        }
      },
      //! Erro interno no servidor
      err => next(err)
    );
  };
};

exports.verifyUser = () => (req, res, next) => {
  const { email, password } = req.body;
  //* Check if receive email and password
  if (!email || !password) {
    res.status(400).json({ error: "You need a email and password." });
    return;
  }
  //* Email and password received
  //* Check if the user exist
  User.findOne({ email })
    .populate("institution")
    .then(user => {
      if (!user) {
        //! User not found
        res.status(401).json({ error: "No user with the given username." });
      } else {
        //* User found, checking the password
        user
          .authenticate(password)
          .then(result => {
            if (result) {
              //* Password ok, can continue
              const { name, institution, email, role, _id } = user;
              req.user = { name, institution, email, role, _id };
              next();
            } else {
              //! Senha não confere
              res.status(401).json({ error: "Wrong password." });
            }
          })
          .catch(err => next(err));
      }
    })
    .catch(err => next(err));
};

const createJWT = (_id, email, name, thumbnail, role, institution) => {
  return jwt.sign(
    {
      _id,
      name,
      email,
      institution,
      thumbnail,
      role
    },
    process.env.SECRET_JWT,
    { expiresIn: 24 * 60 * 60 } //* One day in minutes
  );
};
//* Create and sign a token
exports.signToken = createJWT;

exports.getNewJwt = (req, res, next) => {
  req.jwtToken = createJWT(req.user._id, req.user.name, req.user.email, req.user.thumbnail, req.user.role);
  next();
};
