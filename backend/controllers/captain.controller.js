const captainService = require('../services/captain.services');
const { validationResult } = require('express-validator');
const blackListToken = require('../models/blackListToken.model');


module.exports.registerCaptain = async (req, res, next) => {
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    
    const {fullname, email, password, vehicle, location} = req.body;
    console.log(email)
    console.log(fullname, email, password, vehicle, location);
    const hashedPassword = await captainService.hashPassword(password);
    const captain = await captainService.createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
        vehicle,
        location
    })

    const token = captain.generateAuthToken();
    return res.status(200).json({token, captain});
}

