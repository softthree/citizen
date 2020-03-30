const UserModel = require('../models/user');
const asyncMiddleware = require('../utils/asyncMiddleware');
const status = require('../utils/statusCodes');
const passwordUtils = require('../utils/passwordHash');
const jwt = require('../utils/jwt');
const nodemailer = require("nodemailer");

const generalActions = {
  contact: asyncMiddleware(async (req, res) => {
    console.log(req.body)
    let smtpTransport = nodemailer.createTransport({
      service: "Gmail",
      port: 465,
      // insert the SoftThree Mail credentials in auth
      auth: {
        user: "softthree3@gmail.com",
        pass: "codedecoder"
      }
    });
    let mailOptions = {
      from: req.body.email,
      to: req.body.to,
      subject: "Some One Want To Connect With SoftThree",
      html: req.body.name + " wants to contact you. <br> His / Her Email Is:" + req.body.email + "<br> His / HerMessage:" + req.body.message
    };
    let sentMail = await smtpTransport.sendMail(mailOptions);
    res.status(status.success.accepted).json({
      message: 'Mail Sent Successfully'
    });
  }),

  login: asyncMiddleware(async (req, res) => {
    let user = await UserModel.findOne({ email: req.body.email }).select('+password');
    if (user) {
      let verified = await passwordUtils.comparePassword(req.body.password, user.password);
      if (verified) {
        let loggedUser = user.toObject();
        delete loggedUser.password;
        res.status(status.success.accepted).json({
          message: 'Logged In Successfully',
          data: loggedUser,
          token: 'Bearer ' + await jwt.signJwt({ id: user.id })
        });
      } else {
        res.status(status.client.badRequest).json({
          message: 'Wrong Password'
        });
      }
    } else {
      res.status(status.client.notFound).json({
        message: 'User Not Found'
      });
    }
  })
};

module.exports = generalActions;