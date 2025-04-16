const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [6, 'First name must be at least 6 characters long'],
        },
        lastname: {
            type: String,
        }, 
    },
    email: {
            type: String,
            required: true,
            unique: true,
            minlength: [6, 'Email must be at least 6 characters long'],
    },
    password: {
        type: String,
            required: true,
            select: false,
    },
    socketId: {
        type: String,
    },
})

UserSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {expiresIn: '24h'});
    return token;
}

UserSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

UserSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password, 10);
}

const userModel = mongoose.model('user', UserSchema);

module.exports = userModel;