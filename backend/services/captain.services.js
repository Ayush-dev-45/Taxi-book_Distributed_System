const captainModel = require('../models/captain.model');

module.exports.createCaptain = async ({firstname, lastname, email, password, vehicleType, color, plate, capacity})=> {
    if(!firstname || !lastname || !email || !password || !vehicleType || !color || !plate || !capacity){
        throw new Error('All fields are required');
    }
    const captain = captainModel.create({
        fullname: {
            firstname,
            lastname,
        },
        email,
        password,
        vehicle: {
            vehicleType,
            color,
            plate,
            capacity
        }
    })
    return captain;
};