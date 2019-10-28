const RecordBookModel = require("./recordBookModel");
const ProjectModel = require("../project/projectModel");

exports.paramId = (req, res, next, id) => {
  RecordBookModel.findById(id)
    .then(record => {
      req.record = record;
      next();
    })
    .catch(err => next(err));
};
exports.paramIdProject = (req, res, next, idProject) => {
  const project = isProject;
  const query = { project, institution: req.user.institution };
  if (req.date) {
    query.date = date;
  }
  RecordBookModel.find(query)
    .then(records => {
      req.records = records;
      next();
    })
    .catch(err => next(err));
};
exports.paramIdStudent = (req, res, next, idStudent) => {
  const project = req.projectId;
  const student = idStudent;
  RecordBookModel.find({ project, student })
    .then(records => {
      req.records = records;
      next();
    })
    .catch(err => next(err));
  next();
};

//* Get All from one project with or without date
exports.getAllFromProjectOrFromStudent = (req, res, next) => {
  res.json(req.records);
};

//* Get All
exports.getAll = (req, res, next) => {
  RecordBookModel.find({ institution: req.user.institution })
    .then(users => {
      res.json(users);
    })
    .catch(err => next(err));
};

//* Create All
exports.createAll = (req, res, next) => {
  const { project, date } = req.body;
  const { institution } = req.user;
  ProjectModel.findById(project)
    .then(project => {
      const { students } = project;
      const dateNew = new Date(date);
      const allDocsToInsert = students.map(el => ({ student: el, institution, project: project._id, date: dateNew, presence: true }));
      RecordBookModel.create(allDocsToInsert)
        .then(result => res.json(result))
        .catch(err => next(err));
    })
    .catch(err => next(err));
};

//* Get One
exports.getOne = (req, res, next) => {
  res.json(req.record);
};

//* Edit One
exports.editOne = (req, res, next) => {
  req.record
    .update(req.body)
    .then(record => res.json(record))
    .catch(err => next(err));
};

//* Delete One
exports.deleteOne = (req, res, next) => {
  req.record
    .delete()
    .then(record => res.json(record))
    .catch(err => next(err));
};
