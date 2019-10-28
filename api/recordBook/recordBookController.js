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
exports.paramProjectDate = (req, res, next, date) => {
  req.date = date;
  next();
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

//* Get All from one project with or without date
exports.getAllFromProject = (req, res, next) => {
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
      const allDocsToInsert = students.map(el => ({ student: el, institution, project, date, presence: true }));
      res, json(allDocsToInsert);
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
