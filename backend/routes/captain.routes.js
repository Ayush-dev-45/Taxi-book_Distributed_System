const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const captainController = require('../controllers/captain.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min: 3}).withMessage('firstname must be atleat 3 letter long'),
    body('password').isLength({min: 6}).withMessage('Password must be atleast 6 chracters Long'),
    body('vehicle.color').isLength({min: 3}).withMessage('Vehicle color must be atleast 3 letter long'),
    body('vehicle.plate').isLength({min: 3}).withMessage('Vehicle plate must be atleast 3 letter long'),
    body('vehicle.capacity').isInt({min: 1}).withMessage('Vehicle capacity must be atleast 1'),
    body('vehicle.vehicleType').isIn(["car", "bike", "auto"]).withMessage('Invalid Vehicle Type'),
], captainController.registerCaptain)

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min: 6}).withMessage('Password must be atleast 6 chracters Long')
], captainController.loginCaptain)

router.get('/profile', authMiddleware.authCaptain, captainController.getCaptainProfile);
router.get('/logout', captainController.logoutCaptain);

module.exports = router;