const UserModel = require("./userModel");

exports.paramId = (req, res, next, id) => {
  UserModel.findById(id)
    .then(user => {
      req.userEdit = user;
      next();
    })
    .catch(err => next(err));
};

exports.editUser = (req, res, next) => {
  res.render("public/user-edit", { user: req.userEdit, dash: true });
};

exports.edit = (req, res, next) => {
  const user = req.userEdit;
  const { name, email, state, address, password } = req.body;
  const updateObj = {
    name,
    email,
    address: { state, address }
  };
  if (password != "") {
    updateObj.password = password;
  }
  user
    .update(updateObj)
    .then(result => res.redirect("/dash"))
    .catch(err => next(err));
};
