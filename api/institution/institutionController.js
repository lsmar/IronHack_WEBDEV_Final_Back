const CompanyModel = require("./institutionModel");
const UserModel = require("../user/userModel");

//* Get id from routes
exports.paramId = (req, res, next, id) => {
  CompanyModel.findById(id)
    .then(company => {
      req.company = company;
      next();
    })
    .catch(err => next(err));
};

exports.newCompanyView = (req, res, next) => {
  res.render("public/company-new", { dash: true, user: req.user });
};

//* New company
exports.newCompany = (req, res, next) => {
  const { companyName, deliveryCountry, contactEmail, website, phone, companyLocation } = req.body;
  const user = req.user._id;
  const logo = typeof req.file != "undefined" ? req.file.url : "";
  const newCompany = new CompanyModel({ companyName, deliveryCountry, contactEmail, website, phone, user, logo, companyLocation });
  newCompany
    .save()
    .then(company => {
      req.user
        .update({ company: company._id })
        .then(user => {
          if (typeof req.cookies.app != "undefined") {
            //* Render hbs here
            res.redirect("/dash");
          } else {
            //* Api response
            res.json(company);
          }
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
};

exports.editCompanyView = (req, res, next) => {
  res.render("public/company-new", { company: req.company, user: req.user, dash: true });
};

//* Get all companies
exports.getAllCompany = (req, res, next) => {
  CompanyModel.find().then(companies => {
    if (typeof req.cookies.app != "undefined") {
      //* Render hbs here
      res.render("/company");
    } else {
      //* Api response
      res.json(companies);
    }
  });
};

//* Get one companies
exports.getOneCompany = (req, res, next) => {
  if (typeof req.cookies.app != "undefined") {
    //* Render hbs here
    res.render("/company", { company: req.company });
  } else {
    //* Api response
    res.json(req.company);
  }
};

//* Edit company
exports.editCompany = (req, res, next) => {
  const companyToEdit = req.company;
  companyToEdit
    .update(req.body)
    .then(company => {
      if (typeof req.cookies.app != "undefined") {
        //* Render hbs here
        res.redirect("/dash");
      } else {
        //* Api response
        res.json(req.company);
      }
    })
    .catch(err => next(err));
};

//* Delete company
exports.removeCompany = (req, res, next) => {
  const companyToEdit = req.company;
  companyToEdit
    .remove()
    .then(company => {
      if (typeof req.cookies.app != "undefined") {
        //* Render hbs here
        res.render("/company");
      } else {
        //* Api response
        res.json(req.company);
      }
    })
    .catch(err => next(err));
};
