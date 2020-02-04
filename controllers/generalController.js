const UserModel = require('../models/user');
const asyncMiddleware = require('../utils/asyncMiddleware');
const status = require('../utils/statusCodes');
const passwordUtils = require('../utils/passwordHash');
const jwt = require('../utils/jwt');
const nodemailer = require("nodemailer");

const generalActions = {
  contact: asyncMiddleware(async (req, res) => {
    let smtpTransport = nodemailer.createTransport({
      service: "Gmail",
      port: 465,
      auth: {
        user: "maximaecommerce12@gmail.com",
        pass: "coders123"
      }
    });
    let mailOptions = {
      from: 'maximaecommerce12@gmail.com',
      to: "ayazhussainbs@gmail.com",
      subject: "Message From edgeon.io",
      html: req.body.name + " wants to contact you. <br> His Email Is:" + req.body.email + "<br> His Message:" + req.body.message
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