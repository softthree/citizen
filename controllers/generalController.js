const UserModel = require('../models/user');
const asyncMiddleware = require('../utils/asyncMiddleware');
const status = require('../utils/statusCodes');
const passwordUtils = require('../utils/passwordHash');
const jwt = require('../utils/jwt');
const nodemailer = require("nodemailer");

const generalActions = {
  // Admin

  dashboard: asyncMiddleware(async (req, res) => {
    let users = await UserModel.find();
    if (users) {
      res.status(status.success.accepted).json({
        message: 'User Records',
        status: 'success',
        data: users
      });
    } else {
      res.status(status.success.accepted).json({
        message: 'Users Not Found',
        status: 'failure'
      });
    }
  })
};

module.exports = generalActions;