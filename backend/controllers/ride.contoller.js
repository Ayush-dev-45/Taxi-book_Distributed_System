const rideService = require('../services/ride.service');
const { validationResult } = require('../services/ride.service');
const mapService = require('../services/maps.service');
const ridesModel = require('../models/rides.model');
const { sendMessageToSocketId } = require('../socket');

module.exports.createRide = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const {userId, pickup, destination, vehicleType} = req.body;
        const ride = await rideService.createRide({user: req.user._id, pickup, destination, vehicleType});
        res.status(201).json(ride);

        const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
        const captainsInRadius = await mapService.getCaptainInRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 2);
        ride.otp = "";

        const rideWithUser = await ridesModel.findOne({_id:ride._id}).populate('user');

        captainsInRadius.map(captain => {
            sendMessageToSocketId(captain.socketId, {
                event: 'new-ride',
                data: rideWithUser
            });
        });

    } catch (error) {
        return res.status(500).json({msg: "Internal Server Error"})
    }
}

module.exports.getFare = async (req, res, next) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()});
    }
    const {pickup, destination} = req.query;
    try{
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch(error) {
        return res.status(500).json({msg: "Internal Server Error"});
    }
}

module.exports.confirmRide = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({msg: "Invalid fields"});
    }
    const {rideId} = req.body;
    try {
        const ride = await rideService.confirmRide({rideId, captain: req.captain});

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        });

    return res.status(201).json(ride);
    } catch (error) {
        return res.status(500).json({msg:"Internal server error"});
    }
}

module.exports.startRide = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({msg: "Invalid fields"});
    }
    const { rideId, otp} = req.query;
    try {
        const ride = rideService.startRide({rideId, otp, captain: req.captain});
        
        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        });
        return res.status(200).json(ride);
    } catch (error) {
        return res.status(500).json({msg:"Internal server error"});
    }
}

module.exports.endRide = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({msg: "Invalid fields"});
    }
    const {rideId} = req.body();
    try {
        const ride = await rideService.endRide({rideId, captain: req.captain});

        sendMessageToSocketId(ride.user.socketId, {
            event:'ride-ended',
            data: ride
        });

        return res.status(201).json(ride);
    } catch (error) {
        return res.status(500).json({msg:"Internal server error"});
    }
}