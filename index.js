const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = socketio(server)

// route
app.get('/', (req,res) => {
    res.sendFile(__dirname+ '/index.html');
})

// handle socket connection
io.on('connection' , (socket) => {
    console.log('A new user connected');

     // Assign unique username on connect
    const username = `User-${Math.floor(Math.random() * 1000)}`; // User-123
    socket.username = username; // Store on socket object

     // Send username to this client only
    socket.emit('username', { sender: username });

    //TYPING HANDLER HERE
    socket.on('typing', () => {
        socket.broadcast.emit('typing', { sender: socket.username });
    });

    socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing', { sender: socket.username });
    });

    // handle incomming message
    socket.on('message', (message) => {
        console.log('Message received: ', message);
        const messageWithUser = { 
            sender: socket.username, 
            text: message.text 
        };


        // Brodcast this message to all connected users
        io.emit('message', messageWithUser)
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected')
    })
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log('Server listening on PORT 3000');
})