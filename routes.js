const express = require('express');
const router = express.Router();
const jwt = require('./utils/jwt');
const GeneralController = require('./controllers/generalController');

router.get('/test', (req, res) => {
    res.send('Server Is Running!');
});

router.post('/contact-us', GeneralController.contact);


// router.post('/login', UserController.login);

module.exports = router;