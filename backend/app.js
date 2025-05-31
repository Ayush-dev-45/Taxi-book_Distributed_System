const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const app = express();
const connectToDB = require('./db/db');
const userRoutes = require('./routes/user.routes');
const parser = require('cookie-parser');
const captainRoutes = require('./routes/captain.routes');
const mapRoutes = require('./routes/maps.routes');
const rideRoutes = require('./routes/ride.routes');

connectToDB(); 

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(parser());

app.get('/', (req, res) => {
    res.send('Hello World Ny me');
})

app.use('/users', userRoutes);7
app.use('/captains', captainRoutes);
app.use('/maps', mapRoutes);
app.use('/rides', rideRoutes);

module.exports = app;