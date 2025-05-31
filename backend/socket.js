const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket (server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('join', async (data) => {
            const {userId, userType} = data;
            if(userType === 'user'){
                await userModel.findByIdAndUpdate(userId, {socket: socket.id});
            }
            if(userType === 'captain'){
                await captainModel.findByIdAndUpdate(userId, {socket: socket.id});
            }
        });

        socket.on('update-location-captain', (data) => {
            const {userId, location} = data;
            if(!location || !location.ltd || !location.lng){
                return socket.emit('error', {msg: "Invalid Location"});
            }

            captainModel.findByIdAndUpdate(userId, {
                location: {
                    ltd: location.ltd,
                    lng: location.lng
                }
            });
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

const sendMessageToSocketId = (socketId, messageObject) => {
    console.log(messageObject);
    if(io){
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log("Socket.io is not initialised");
    }
}

module.exports = {initializeSocket, sendMessageToSocketId};