const UserModel = require('../models/user');
const asyncMiddleware = require('../utils/asyncMiddleware');
const status = require('../utils/statusCodes');
const passwordUtils = require('../utils/passwordHash');
const jwt = require('../utils/jwt');

const userActions = {
  register: asyncMiddleware(async (req, res) => {
    let user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      res.status(status.client.badRequest).json({
        message: 'Email Already Exists'
      });
    } else {

      // Save new user to db
      let hashedPassword = await passwordUtils.hashPassword(req.body.password);
      let newUser = new UserModel({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      });
      let savedUser = await newUser.save();

      // Remove Password From Object
      let addedUser = savedUser.toObject();
      delete addedUser.password;
      res.status(status.success.created).json({
        message: 'User Created Successfully',
        data: addedUser,
        token: 'Bearer ' + await jwt.signJwt({ id: savedUser.id })
      });
    }
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

module.exports = userActions;