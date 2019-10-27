const StudentModel = require("./studentModel");
const UserModel = require("../user/userModel");

exports.paramId = (req, res, next, id) => {
  UserModel.findById(id)
    .then(user => {
      req.userEdit = user;
      next();
    })
    .catch(err => next(err));
};

// //* Get teacher`s projects
// exports.getMy = (req, res, next) => {
//   StudentModel.find({teachers:{$in:req.user._id }})
//     .then(student => {
//       res.json(student);
//     })
//     .catch(err => next(err));
// };

//* Get All projects
exports.getAll = (req, res, next) => {
  StudentModel.find()
    .then(student => {
      res.json(student);
    })
    .catch(err => next(err));
};

//* Create One
exports.createOne = (req, res, next) => {
  const { name, classRoom, grade, institution} = req.body;
  const newStudent = new StudentModel({ name, classRoom, grade, institution});
  newStudent
    .save()
    .then(student => {
      res.json(student);
    })
    .catch(err => next(err));
};

//* Get One
exports.getOne = (req, res, next) => {
  StudentModel.findById({ _id: req.body.id })
    .then(student => {
      res.json(student);
    })
    .catch(err => next(err));
};

// //* Edit One
// exports.editOne = (req, res, next) => {
//   const { name, teachers, students, description, subjects, image } = req.body;
//   ProjectModel
//     .findByIdAndUpdate({ _id: req.body.id },{ name, teachers, students, description, subjects, image })
//     .then(project => {
//       res.json(project);
//     })
//     .catch(err => next(err));
// };

// //* Delete One
// exports.deleteOne = (req, res, next) => {
//   ProjectModel
//     .findByIdAndDelete({ _id: req.body.id })
//     .then(user => res.json(user))
//     .catch(err => next(err));
// };