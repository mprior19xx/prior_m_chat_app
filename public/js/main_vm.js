// imports always go first - if we're importing anything
import ChatMessage from "./modules/ChatMessage.js";

const socket = io();

// Sets userNum to current number of other users in room on new join
function setUserId({sID, count}) {
    vm.socketID = sID;

    vm.userNum = count;
};


//plays sound on user connection
//adds user to userNum on connection
//Displays message for new user on connection
function connectSound(message){
    var connectSound = new Audio("audio/connect.mp3");
    connectSound.play();

    vm.userNum += 1;

    if(message !== vm.socketID) {
        socket.emit('connection_message', {
            content: `A new user has connected.`,
            name: "Console"
        })
    }
}

// Plays sound when on user disconnect
// Remove user from userNum on disconnect
// Display message for user disconnect
function runDisconnectMessage(message) {
    var disconnectSound = new Audio("audio/disconnect.mp3");
    disconnectSound.play();

    vm.userNum -= 1;

    socket.emit('connection_message', {
        content: message,
        name: "Console"
    })
};


// Take the incoming message and push it into Vue
// Plays sound when messages are pushed
function appendNewMessage(msg) {
    vm.messages.push(msg);
    
    if(msg.id !== this.id && msg.message.name !== "Console"){
        var newMessageSound = new Audio("audio/message.mp3");
        newMessageSound.play();
    }
};

// This is our main Vue instance
const vm = new Vue({
    data: {
        socketID: "",
        messages: [],
        message: "",
        nickName: "",
        userNum: 0
    },

    methods: {
        dispatchMessage() {
            socket.emit('chat_message', {
                content: this.message,
                name: this.nickName || "Anonymous"
            })

            this.message = "";
        }
    },

    components: {
        newmessage: ChatMessage
    },

    mounted: function() {
        console.log('mounted');
    }
}).$mount("#app");

// Some event handling -> These events are coming from the server
socket.addEventListener('connected', setUserId);
socket.addEventListener('new_user', connectSound);
socket.addEventListener('user_disconnect', runDisconnectMessage);
socket.addEventListener('new_message', appendNewMessage);