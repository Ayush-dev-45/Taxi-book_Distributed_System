const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const authMiddleware = require('../middleware/auth.middleware');
const rideController = require('../controllers/ride.contoller')

router.post('/create',
    authMiddleware.authUser,
    body('Destination').isString().isLength({min: 3}).withMessage("Invalid userID"),
    body('Destination').isString().isLength({min: 3}).withMessage("Invalid userID"),
    body('vehicleType').isString().isIn(['auto', 'car', 'moto']).withMessage("Invalid userID"),
    rideController.createRide
)

router.get('/get-fare',
    authMiddleware.authUser,
    query('pickup').isString().isLength({min: 3}).withMessage("Invalid Pickup"),
    query('destination').isString().isLength({min: 3}).withMessage("Invalid destination"),
    rideController.getFare
)

router.post('/confirm',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage("Inavlid id"),
    rideController.confirmRide
)

router.get('/startRide',
    authMiddleware.authCaptain,
    query('rideId').isMongoId().withMessage('Inavlid rideId'),
    query('otp').isInt().isLength({min: 6}).withMessage("Otp sjpuld be of 6 digits"),
    rideController.startRide
)

router.post('/endRide',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage("Inavlid id"),
    rideController.endRide
)

module.exports = router;