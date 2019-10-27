const StudentModel = require("./studentModel");
const UserModel = require("../user/userModel");

exports.paramId = (req, res, next, id) => {
  StudentModel.findById(id)
    .populate("projects")
    .then(student => {
      req.student = student;
      next();
    })
    .catch(err => next(err));
};

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
  const { name, classRoom, grade} = req.body;
  const newStudent = new StudentModel({ name, classRoom, grade, institution:req.user.insitution});
  newStudent
    .save()
    .then(student => {
      res.json(student);
    })
    .catch(err => next(err));
};

//* Get One
exports.getOne = (req, res, next) => {
  res.json(req.student);
};

//* Edit One
exports.editOne = (req, res, next) => {
  const studentToEdit = req.student;
  studentToEdit
    .update(req.body)
    .then(student => {
      res.json(student);
    })
    .catch(err => next(err));
};

//* Delete One
exports.deleteOne = (req, res, next) => {
  const studentToDelete = req.student;
  studentToDelete
    .delete()
    .then(student => {
      res.json(student);
    })
    .catch(err => next(err));
};