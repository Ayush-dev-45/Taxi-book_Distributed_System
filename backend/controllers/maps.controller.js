const mapService = require('../services/maps.service');

module.exports.getCoordinates = async (req, res, next) => {
    const { address } = req.query;
    try {
        const location = await mapService.getAddressCoordinate(address);
        res.status(200).json(location);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports.getDistanceTime = async (req, res, next) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { origin, destination } = req.query;
        const distanceTime = await mapService.getDistanceTime(origin, destination);
        res.status(200).json(distanceTime);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports.getAutoCompleteSuggestions = async (req, res, next) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { input } = req.query;
        const suggestions = await mapService.getAutoCompleteSuggestions(input);
        res.status(200).json(suggestions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}