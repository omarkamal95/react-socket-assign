// https://expressjs.com/en/starter/hello-world.html
const express = require('express');
// https://github.com/expressjs/body-parser
const bodyParser = require('body-parser');
// Google npm cors :P
const cors = require('cors');
const app = express()
const firebase = require("firebase");
// const http = require('http').Server(app);
//
// const io = require('socket.io')(http);

// https://github.com/expressjs/body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

// let config = {
//     apiKey: "AIzaSyDgaxZvvK1_2S9e-INT8pLEGIYQ3OkhwSY",
//     authDomain: "messaging-app-assignment.firebaseapp.com",
//     databaseURL: "https://messaging-app-assignment.firebaseio.com",
//     projectId: "messaging-app-assignment",
//     storageBucket: "messaging-app-assignment.appspot.com",
//     messagingSenderId: "430264428693"
// };
// firebase.initializeApp(config);
// https://expressjs.com/en/starter/basic-routing.html
app.get('/', function(req, res) {
    res.send('Hello World you should probably try GET /api/todo-list !')
})

// require('./events')(io)

module.exports = app
    // {
    //   io,
    //   app,
    //   http
    // }
