const UserModel = require("./userModel");
const randomString = require("randomstring");
const base64 = require("base-64");

exports.paramId = (req, res, next, id) => {
  UserModel.findById(id)
    .select({ password: 0 })
    .then(user => {
      req.userEdit = user;
      next();
    })
    .catch(err => next(err));
};
//* Get me
exports.getMe = (req, res, next) => {
  res.json(req.user);
};

//* Get All
exports.getAll = (req, res, next) => {
  UserModel.find({ institution: req.user.institution })
    .select({ password: 0 })
    .then(users => {
      res.json(users);
    })
    .catch(err => next(err));
};

//* Create One
exports.createOne = (req, res, next) => {
  const { name, email, role } = req.body;
  const { institution } = req.user;
  const token = base64.encode(JSON.stringify({ name, email, token: randomString.generate(15) }));
  const newUser = new UserModel({ name, email, role, institution, token });
  newUser
    .save()
    .then(user => {
      //TODO Send the email for the new user
      res.json(user);
    })
    .catch(err => next(err));
};

//* Get One
exports.getOne = (req, res, next) => {
  res.json(req.userEdit);
};

//* Edit One
exports.editOne = (req, res, next) => {
  req.userEdit
    .update(req.body)
    .then(user => res.json(user))
    .catch(err => next(err));
};

//* Delete One
exports.deleteOne = (req, res, next) => {
  req.userEdit
    .delete()
    .then(user => res.json(user))
    .catch(err => next(err));
};

//* Change Password
exports.changePass = (req, res, next) => {
  const { token, password } = req.body;
  UserModel.findOneAndUpdate({ token }, { token: undefined, password })
    .then(user => res.json({ success: true }))
    .catch(err => next(err));
};
