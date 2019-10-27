const ProjectModel = require("./projectModel");
const StudentModel = require("../student/studentModel");
const UserModel = require("../user/userModel");


exports.paramId = (req, res, next, id) => {
  UserModel.findById(id)
    .then(user => {
      req.userEdit = user;
      next();
    })
    .catch(err => next(err));
};

//* Get teacher`s projects
exports.getMy = (req, res, next) => {
  ProjectModel.find({
      teachers: {
        $in: req.user._id
      }
    })
    .populate('teachers', 'name')
    .populate('students')
    .then(projects => {
      res.json(projects);
    })
    .catch(err => next(err));
};

//* Get All projects
exports.getAll = (req, res, next) => {
  ProjectModel.find()
    .populate('teachers', 'name')
    .populate('students')
    .then(users => {
      res.json(users);
    })
    .catch(err => next(err));
};

//* Create One
exports.createOne = (req, res, next) => {
  const {
    classRoom,
    grade,
    institution
  } = req.body;
  StudentModel
  .find({$and : [ { classRoom : classRoom, grade:grade, institution:institution }]})
  .then(studentsList => {
  const newProject = new ProjectModel({
    name:req.body.name,
    teachers:req.body.teachers,
    description:req.body.description,
    subjects:req.body.subjects,
    image:req.body.image,
    students: studentsList
  });
  newProject
    .save()
    .then(project => {
      res.json(project);
    })
    .catch(err => next(err));
  })
  .catch(err => next(err));
};

//* Get One
exports.getOne = (req, res, next) => {
  ProjectModel
    .findById({
      _id: req.body.id
    })
    .populate('teachers', 'name')
    .populate('students')
    .then(project => {
      res.json(project);
    })
    .catch(err => next(err));
};

//* Edit One
exports.editOne = (req, res, next) => {
  const {
    name,
    teachers,
    students,
    description,
    subjects,
    image
  } = req.body;
  ProjectModel
    .findByIdAndUpdate({
      _id: req.body.id
    }, {
      name,
      teachers,
      students,
      description,
      subjects,
      image
    })
    .then(project => {
      res.json(project);
    })
    .catch(err => next(err));
};

//* Delete One
exports.deleteOne = (req, res, next) => {
  ProjectModel
    .findByIdAndDelete({
      _id: req.body.id
    })
    .then(user => res.json(user))
    .catch(err => next(err));
};

//* Change Password
// exports.changePass = (req, res, next) => {
//   const {
//     token,
//     password
//   } = req.body;
//   ProjectModel.findOneAndUpdate({
//       token
//     }, {
//       token: undefined,
//       password
//     })
//     .then(user => res.json({
//       success: true
//     }))
//     .catch(err => next(err));
// };