const UserModel = require("./userModel");
const randomString = require("randomstring");
const base64 = require("base-64");
const nodemailer = require("nodemailer");

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
      const { name, email, token } = user;
      sendNewUserEmail({ name, email, token });
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
  UserModel.findOne({ token })
    .then(user => {
      user.token = undefined;
      user.password = password;
      user
        .save()
        .then(result => res.json({ success: true }))
        .catch(err => next(err));
    })
    .catch(err => next(err));
};

//* Send email with link to create a password
const sendNewUserEmail = ({ token, email, name }) => {
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "lynx.edu7@gmail.com",
      pass: process.env.GMAIL_PASS
    }
  });
  transporter
    .sendMail({
      from: '"The Best Edu system" <lynx.edu7@gmail.com>',
      to: email,
      subject: "Bem vindo!",
      text: "Incrível seja bem vindo!",
      html: `<b>Incrível, ${name} seja bem vindo(a)!</b><h1><a href="${process.env.FRONT_URL}/newUser/${token}">Registre sua senha</a>  </h1>`
    })
    .then(info => console.log(info))
    .catch(error => console.log(error));
};
