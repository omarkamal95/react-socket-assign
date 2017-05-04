import React, { Component } from 'react';
import socket from '~/src/socket'

import Messages from './components/Messages'
import Users from './components/Users'

import firebase from 'firebase';
// import reactfire from 'reactfire';
// import firebaseui from 'firebaseui';

let config = {
    apiKey: "AIzaSyDgaxZvvK1_2S9e-INT8pLEGIYQ3OkhwSY",
    authDomain: "messaging-app-assignment.firebaseapp.com",
    databaseURL: "https://messaging-app-assignment.firebaseio.com",
    projectId: "messaging-app-assignment",
    storageBucket: "messaging-app-assignment.appspot.com",
    messagingSenderId: "430264428693"
};
firebase.initializeApp(config);
let provider = new firebase.auth.FacebookAuthProvider();
let database = firebase.database();


let isTyping = false;
class App extends Component {
    constructor() {
        super()
          
        this.state = {
            currentUser: {},
            userTyping: "",
            newMessage: "",
            user: null,
            socketId: null
        }
    }
    componentWillMount() {
        socket.on('current user', (user) => {
            this.setState({
                currentUser: user
            })
        });
        socket.on('new socket user', (socketId) =>{
            this.setState({
                socketId
            })
        })
        socket.on('user typing', (user) => {
            this.setState({
                userTyping: user.nickname
            })
        });
        socket.on('stopped typing', (user) => {
            this.setState({
                userTyping: ""
            })
        });
        let thisState = this;
        // firebase.database().ref('messages').once('value').then(function(snapshot) {
        //         snapshot.forEach(function(childSnap){
        //            console.log("lolololol MESSAGE ", childSnap.val());
        //            thisState.setState(prevState=>{
        //                return { prevMessages: prevState.prevMessages.concat(childSnap.val()) }
        //           })
        //        })
                
        //   });
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in.
                // var displayName = user.displayName;
                // var email = user.email;
                // var emailVerified = user.emailVerified;
                // var photoURL = user.photoURL;
                // var uid = user.uid;
                // var providerData = user.providerData;
                thisState.setState({
                    user
                })
                user.socketId = thisState.socketId;
                socket.emit('new user', user)
                console.log("signed in")
            } else {
                // User is signed out.
                thisState.setState({
                  user: null
                })
                console.log("signed out")
            }
        }, function(error) {
            console.log(error);
        });
    }

    render() {
      let toBeRendered = null;
      if(this.state.user != null){
        toBeRendered =  (
            <app>
            <div className="sidebar-div">
              <Users />
            </div>
            <div className="messaging-div">
              <Messages fireBase={firebase} newMessage={this.state.newMessage}/>
              {this.state.userTyping !== "" && <p className="typing-text"> {this.state.userTyping} is typing ...</p>}
              <form onSubmit={this.sendMessage}>
                <input ref={(input)=> this.input = input } onChange={this.sendTyping} autoComplete="off" />
                <button onClick={this.sendMessage} >Send</button>
              </form>
            </div>
            <button className="logout-btn" href="#" onClick={this.logoutMethod}>logout</button>
          </app>
        );
      }
      else{
        toBeRendered = (<button className="login-btn" onClick={this.loginWithFacebook}>Sign in with facebook</button>);
      }
      return toBeRendered;
    }
    sendTyping = (event) => {
        if (isTyping && event.target.value === "") {
            socket.emit('stopped typing', this.state.currentUser)
            isTyping = false
        } else if (!isTyping && event.target.value !== "") {
            socket.emit('user typing', this.state.currentUser)
            isTyping = true
        }
    }
    logoutMethod = (event) => {
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
          this.setState({
             user: null
          })
        }).catch(function(error) {
          console.err("Error while signing out ",error)
        });
    }

     saveNewMessage = (displayName, userId, message) => {
          let timestamp = new Date();
          console.log("SAVING NEW MESSAGE ", displayName, userId, this.input.value, timestamp);
          database.ref('messages/' + timestamp ).set({
              message,
              timestamp,
              userId,
              displayName
          });
      }
    sendMessage = (event) => {
        event.preventDefault();
        socket.emit('chat message', this.input.value);
        socket.emit('stopped typing', this.state.currentUser)
        isTyping = false;
        console.log("NEW MESSAGE ", this.input.value);
        this.saveNewMessage(this.state.user.displayName, this.state.user.uid, this.input.value)
        let message = {
          displayName: this.state.user.displayName, 
          userId: this.state.user.uid, 
          message: this.input.value
        }
        this.setState({ newMessage: message })
        this.input.value = ''
    }

    loginWithFacebook = () => {
        firebase.auth().signInWithPopup(provider).then(function(result) {
            var token = result.credential.accessToken;
            this.setState({ user: result.user });
        }.bind(this));
    }
}

export default App;
