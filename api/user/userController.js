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

//* Get All Teachers
exports.getAllTeachers = (req, res, next) => {
  UserModel.find({ role: "TEACHER", institution: req.user.institution })
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
      from: '"Lynx Educação" <lynx.edu7@gmail.com>',
      to: email,
      subject: `${name}, seja bem vindo ao Lynx Educação!`,
      text: `${name}, Bem vindo ao Lynx!!!\n\nAgora você precisa cadastrar a sua senha para obter acesso ao sistema Lynx, aonde você poderá, acompanhar os seus alunos ao longo de jornadas de conhecimento.\n\nCadastre sua senha ${process.env.FRONT_URL}/newUser/${token}\n\n
      © Lynx Corporate\n\nEsse é um e-mail automático, favor não responder!`,
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" /><!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=Edge" /><!--<![endif]--> <!--[if (gte mso 9)|(IE)]> <xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml> <![endif]--> <!--[if (gte mso 9)|(IE)]><style type="text/css">body{width:600px;margin:0 auto}table{border-collapse:collapse}table,td{mso-table-lspace:0pt;mso-table-rspace:0pt}img{-ms-interpolation-mode:bicubic}</style><![endif]--><style type="text/css">body,p,div{font-family:arial;font-size:14px}body{color:#000}body a{color:#1188E6;text-decoration:none}p{margin:0;padding:0}table.wrapper{width:100% !important;table-layout:fixed;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%;-moz-text-size-adjust:100%;-ms-text-size-adjust:100%}img.max-width{max-width:100% !important}.column.of-2{width:50%}.column.of-3{width:33.333%}.column.of-4{width:25%}@media screen and (max-width:480px){.preheader .rightColumnContent, .footer .rightColumnContent{text-align:left !important}.preheader .rightColumnContent div, .preheader .rightColumnContent span, .footer .rightColumnContent div, .footer .rightColumnContent span{text-align:left !important}.preheader .rightColumnContent, .preheader .leftColumnContent{font-size:80% !important;padding:5px 0}table.wrapper-mobile{width:100% !important;table-layout:fixed}img.max-width{height:auto !important;max-width:480px !important}a.bulletproof-button{display:block !important;width:auto !important;font-size:80%;padding-left:0 !important;padding-right:0 !important}.columns{width:100% !important}.column{display:block !important;width:100% !important;padding-left:0 !important;padding-right:0 !important;margin-left:0 !important;margin-right:0 !important}}</style></head><body><center class="wrapper" data-link-color="#1188E6" data-body-style="font-size: 14px; font-family: arial; color: #000000; background-color: #ffffff;"><div class="webkit"><table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#ffffff"><tr><td valign="top" bgcolor="#ffffff" width="100%"><table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td width="100%"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td> <!--[if mso]><center><table><tr><td width="600"> <![endif]--><table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width:600px;" align="center"><tr><td role="modules-container" style="padding: 0px 0px 0px 0px; color: #000000; text-align: left;" bgcolor="#ffffff" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;"><tr><td role="module-content"><p></p></td></tr></table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"><tr><td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor=""></td></tr></table><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"><tr><td style="font-size:6px;line-height:10px;padding:0px 0px 0px 0px;" valign="top" align="center"> <img class="max-width" border="0" style="display:block;color:#000000;text-decoration:none;font-family:Helvetica, arial, sans-serif;font-size:16px;max-width:40% !important;width:40%;height:auto !important;" src="https://marketing-image-production.s3.amazonaws.com/uploads/960a03ee8a38ae69285f0e028983f32e04bed36b0dc8000668e7c302e0770125d8b5f5e711602d29979d0e893520a2666d7933f2ad52476c3934b69f395c96ee.png" alt="" width="240"></td></tr></table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"><tr><td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor=""></td></tr></table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"><tr><td style="padding:18px 18px 18px 18px;line-height:25px;text-align:justify;" height="100%" valign="top" bgcolor=""><div><span style="font-family:lucida sans unicode,lucida grande,sans-serif;"><span style="font-size:18px;"><strong>${name}</strong>, Bem vindo ao Lynx!!!</span></span></div><div>&nbsp;</div><div><span style="font-family:lucida sans unicode,lucida grande,sans-serif;"><span style="font-size:16px;">Agora voc&ecirc; precisa cadastrar a sua senha para obter acesso ao sistema Lynx, aonde voc&ecirc; poder&aacute;, acompanhar os seus alunos ao longo de jornadas de conhecimento.</span></span></div><div>&nbsp;</div></td></tr></table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"><tr><td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor=""></td></tr></table><table border="0" cellPadding="0" cellSpacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed" width="100%"><tbody><tr><td align="center" bgcolor="" class="outer-td" style="padding:0px 0px 0px 0px"><table border="0" cellPadding="0" cellSpacing="0" class="button-css__deep-table___2OZyb wrapper-mobile" style="text-align:center"><tbody><tr><td align="center" bgcolor="#f79f1c" class="inner-td" style="border-radius:6px;font-size:16px;text-align:center;background-color:inherit"><a href="${process.env.FRONT_URL}/newUser/${token}" style="background-color:#f79f1c;border:1px solid #333333;border-color:#f79f1c;border-radius:54px;border-width:1px;color:#ffffff;display:inline-block;font-family:helvetica,arial,sans-serif;font-size:16px;font-weight:normal;letter-spacing:0px;line-height:16px;padding:12px 18px 12px 18px;text-align:center;text-decoration:none" target="_blank">Cadastre sua senha</a></td></tr></tbody></table></td></tr></tbody></table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"><tr><td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor=""></td></tr></table><table class="module" role="module" data-type="divider" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"><tr><td style="padding:0px 0px 0px 0px;" role="module-content" height="100%" valign="top" bgcolor=""><table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" height="2px" style="line-height:2px; font-size:2px;"><tr><td style="padding: 0px 0px 2px 0px;" bgcolor="#338ceb"></td></tr></table></td></tr></table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"><tr><td style="padding:18px 0px 18px 0px;line-height:22px;text-align:inherit;" height="100%" valign="top" bgcolor=""><div style="text-align: center;"><span style="color: rgb(84, 84, 84); font-family: arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400;">&copy;&nbsp;</span>Lynx Corporate</div><div style="text-align: center;"><span style="color:#A9A9A9;">Esse &eacute; um e-mail autom&aacute;tico, favor n&atilde;o responder!</span></div></td></tr></table></td></tr></table> <!--[if mso]></td></tr></table></center> <![endif]--></td></tr></table></td></tr></table></td></tr></table></div></center></body></html>`
    })
    .then(info => console.log(info))
    .catch(error => console.log(error));
};
