const mongoose = require('mongoose');

function connectToDB() {
    mongoose.connect(process.env.DB_CONNECT, {
}).then(() => {
        console.log('Connected to database');
    }).catch((err) => {
        console.log('Error connecting to database', err);
    });
}

module.exports = connectToDB;