const bcrypt = require('bcrypt');
const saltRounds = 10;
const asyncMiddleware = require('../utils/asyncMiddleware');

function hashPassword(password) {
    return bcrypt.hash(password, saltRounds);
}

function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}

module.exports = {
    hashPassword,
    comparePassword
};