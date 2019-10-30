const RecordBookModel = require("./recordBookModel");
const ProjectModel = require("../project/projectModel");
const mongoose = require("mongoose");

exports.paramId = (req, res, next, id) => {
  RecordBookModel.findById(id)
    .populate("student")
    .then(record => {
      req.record = record;
      next();
    })
    .catch(err => next(err));
};

exports.paramIdStudent = (req, res, next, idStudent) => {
  req.idStudent = idStudent;
  next();
};

//* Get All from one project with or without date
exports.getAllFromProjectOrFromStudent = (req, res, next) => {
  const query = { institution: req.user.institution };
  if (req.idProject) {
    query.project = req.idProject;
  }
  if (req.date) {
    query.date = new Date(req.date);
  }
  if (req.idStudent) {
    query.student = req.idStudent;
  }
  RecordBookModel.find(query)
    .populate("student")
    .then(records => {
      res.json(records);
    })
    .catch(err => next(err));
};

//* Get All from one Student in a project to make the review
exports.getAllFromAProjectReview = (req, res, next) => {
  const query = { institution: req.user.institution, project: req.idProject, student: req.idStudent };
  RecordBookModel.find(query)
    .populate("student")
    .then(records => {
      const result = {};
      if (records.length == 0) return res.json({ error: "No record for this student in the project!" });
      result.absences = records.filter(el => !el.presence).length;
      result.totalDays = records.length;
      result.student = records[0].student;
      const present = records.filter(el => el.presence);
      const tagsToCalc = present.filter(el => el.tags.length != 0);
      result.noReview = result.totalDays - tagsToCalc.length - result.absences;
      const allTags = tagsToCalc.map(el => el.tags);
      for (let idx = 0; idx < allTags[0].length; idx += 1) {
        const key = allTags[0][idx].tagName;
        const filteredTags = allTags.filter(el => el[idx].value);
        result.tags[key] = filteredTags.length;
      }
      res.json(result);
    })
    .catch(err => next(err));
};

//* Get getDatesFromProject
exports.getDatesFromProject = (req, res, next) => {
  const query = [{ $match: { project: mongoose.Types.ObjectId(req.idProject) } }, { $group: { _id: "$date" } }, { $sort: { _id: -1 } }];
  RecordBookModel.aggregate(query)
    .then(records => {
      res.json(records.map(el => ({ date: el._id.toISOString().slice(0, el._id.toISOString().indexOf("T")) })));
    })
    .catch(err => next(err));
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
