const ProjectModel = require("./projectModel");
const StudentModel = require("../student/studentModel");

exports.paramId = (req, res, next, id) => {
  ProjectModel.findById(id)
    .populate("teachers", "name")
    .populate("students")
    .then(project => {
      req.project = project;
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
    .populate("teachers", "name")
    .populate("students")
    .then(projects => {
      res.json(projects);
    })
    .catch(err => next(err));
};

//* Get All projects
exports.getAll = (req, res, next) => {
  ProjectModel.find({ institution: req.user.institution })
    .populate("teachers")
    .populate("students")
    .then(users => {
      res.json(users);
    })
    .catch(err => next(err));
};

//* Create One
exports.createOne = (req, res, next) => {
  const { classRoom, grade } = req.body;
  StudentModel.find({ $and: [{ classRoom: classRoom, grade: grade, institution: req.user.institution }] })
    .select("_id")
    .then(studentsList => {
      const newProject = new ProjectModel({
        name: req.body.name,
        teachers: req.body.teachers,
        description: req.body.description,
        subjects: req.body.subjects,
        image: req.body.image,
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
  res.json(req.project);
};

//* Edit One
exports.editOne = (req, res, next) => {
  const projectToEdit = req.project;
  projectToEdit
    .update(req.body)
    .then(project => {
      res.json(project);
    })
    .catch(err => next(err));
};

//* Delete One
exports.deleteOne = (req, res, next) => {
  const projectToDelete = req.project;
  projectToDelete
    .delete()
    .then(project => {
      res.json(project);
    })
    .catch(err => next(err));
};
