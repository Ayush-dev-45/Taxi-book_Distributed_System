const rideModel = require('../models/rides.model');
const { validate, findById } = require('../models/user.model');
const mapService = require('../services/maps.service');
const crypto = require('crypto');

module.exports.createRide = async (user, pickup, destination, vehicleType) => {
    if(!user || !pickup || !destination || !vehicleType){
        throw new Error("All fields are required");
    }
    const fare = getFare(pickup, destination);

    const ride = rideModel.create({
        user,
        pickup,
        destination,
        otp: getOtp(6),
        fare: fare[vehicleType]
    })

    return ride;
}

function getOtp(){
    return crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
}

async function getFare(pickup, destination) {
    if(!pickup || !destination){
        throw new Error("Pickup and Destination is required");
    }

    const distanceTime = await mapService.getDistanceTime(pickup, destination);
    const baseFare = {
        auto: 30,
        car: 50,
        moto: 20
    };

    const perKmRate = {
        auto: 10,
        car: 15,
        moto: 8
    };

    const perMinuteRate = {
        auto: 2,
        car: 3,
        moto: 1.5
    };

    const fare = {
        auto: Math.round(baseFare.auto + ((distanceTime.distance.value / 1000) * perKmRate.auto) + ((distanceTime.duration.value / 60) * perMinuteRate.auto)),
        car: Math.round(baseFare.car + ((distanceTime.distance.value / 1000) * perKmRate.car) + ((distanceTime.duration.value / 60) * perMinuteRate.car)),
        moto: Math.round(baseFare.moto + ((distanceTime.distance.value / 1000) * perKmRate.moto) + ((distanceTime.duration.value / 60) * perMinuteRate.moto))
    };

    return fare;
}

module.exports.confirmRide = async (rideId, captain) => {
    if(!rideId){
        throw new Error('Ride id is required');
    }
    await rideModel.findOneAndUpdate({_id: rideId},{
        status: 'accepted',
        captain: captain._id
    });

    const ride = rideModel.findOne({_id: rideId}).populate('user').populate('captain').select('+otp');
    if(!ride){
        throw new Error('Ride not Found');
    }
    return ride;
}

module.exports.startRide = async (rideId, otp, captain) => {
    if(!rideId || !otp){
        throw new Error("Inbalid rideId or Otp");
    }
    const ride = await rideModel.findOne({_id: rideId}).populate('user').populate('captain').select('+otp');
    if(!ride){
        throw new Error("ride not found");
    }
    if(ride.otp !== otp){
        throw new Error("otp incorrect");
    }
    await rideModel.findByIdAndUpdate({_id:rideId},{
        status: 'ongoing'
    });
    return ride;
}

module.exports.endRide = async (rideId, captain) => {
    if(!rideId || !captain){
        throw new Error('RideID and captain is required');
    }

    const ride = await rideModel.findById({_id: rideId, captain: captain._id}).populate('captain').populate('user');
    if(!ride){
        throw new Error('ride is not found');
    }
    if(ride.status !== 'ongoing'){
        throw new Error('ride is not ongoing');
    }

    await rideModel.findByIdAndUpdate({_id: rideId}, {
        status: 'completed'
    });

    return ride;
}

module.exports.getFare;