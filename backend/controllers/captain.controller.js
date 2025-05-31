const captainService = require('../services/captain.services');
const { validationResult } = require('express-validator');
const blackListToken = require('../models/blackListToken.model');
const captainModel = require('../models/captain.model');

module.exports.registerCaptain = async (req, res, next) => {
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    
    const {fullname, email, password, vehicle} = req.body;
    console.log(email)

    const isCaptainAlreadyExists = await captainModel.findOne({email});
    if(isCaptainAlreadyExists){
        return res.status(400).json({msg: "Captain already exists"});
    }

    const hashedPassword = await captainModel.hashPassword(password);
    const captain = await captainService.createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
        vehicleType: vehicle.vehicleType,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity
    })

    const token = captain.generateAuthToken();
    return res.status(200).json({token, captain});
}

module.exports.loginCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const captain = await captainModel.findOne({ email }).select('+password');
    if (!captain) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await captain.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = captain.generateAuthToken();
    res.cookie('token', token);
    res.status(200).json({ token, captain });
}

module.exports.getCaptainProfile = async (req,res, next) => { 
    return res.status(201).json({captain: req.captain});
}

module.exports.logoutCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    res.clearCookie('token');
    await blackListToken.create({token});
    res.status(201).json({msg: "Logged out Successfully"});
}