const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min: 3}).withMessage('firstname must be atleat 3 letter long'),
    body('password').isLength({min: 6}).withMessage('Password must be atleast 6 chracters Long')
], userController.registerUser)

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min: 6}).withMessage('Password must be atleast 6 chracters Long')
], userController.userLogin)

router.get('/profile', authMiddleware.authUser, userController.getUserProfile);

router.get('/logout', userController.logoutUser);


module.exports = router;