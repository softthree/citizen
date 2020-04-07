const express = require('express');
const router = express.Router();
const jwt = require('./utils/jwt');
const GeneralController = require('./controllers/generalController');
const UserController = require('./controllers/userController')

router.get('/test', (req, res) => {
    res.send('Server Is Running!');
});

// User Routes

router.post('/login', UserController.login);
router.post('/register', UserController.register);

module.exports = router;