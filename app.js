//Server File

var express = require('express');
var app = express();

//import the socket.io library
const io = require('socket.io')();

const port = process.env.PORT || 3030;

// tell express where our static files are (js, images, css etc)
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

const server = app.listen(port, () => {
    console.log(`app is running on port ${port}`);
});

//socket.io message functionality

//attach socket.io
io.attach(server);

io.on('connection', function(socket) {
    console.log('user connection');
    //fire off emit
    socket.emit('connected', { sID: `${socket.id}`, message: 'new connection'});

    //listen for an incomming message from user socket
    //msg is the incomming message from the user
    socket.on('chat_message', function(msg) {
        console.log(msg);

        //when we get the message send ti to everyone to see
        //io ensures connections, and makes sure all users get the msg
        io.emit('new_message', { id: socket.id, message: msg })
    })


    //listen for disconnection
    socket.on('disconnect', function(){
        console.log('user has disconnected');

        message = `${socket.id} has left the Chat.`;
        io.emit('user_disconnect', message);
    })
})
