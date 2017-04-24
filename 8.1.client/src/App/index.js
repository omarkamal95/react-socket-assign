import React, { Component } from 'react';
import socket from '~/src/socket'

import Messages from './components/Messages'
import Users from './components/Users'

let isTyping = false;
class App extends Component {
  constructor() {
    super()
    this.state = {
      currentUser: {},
      userTyping: "",
      newMessage: "",
    }
  }
  componentWillMount() {
    socket.on('current user', (user) => {
      this.setState({
        currentUser: user
      })
    });
    socket.on('user typing', (user) =>{
        this.setState({
          userTyping: user.nickname
        })
    });
    socket.on('stopped typing', (user) =>{
        this.setState({
          userTyping: ""
        })
    });
  }
  render() {
    return (
      <app>
        <div className="sidebar-div">
          <Users />
        </div>
        <div className="messaging-div">
          <Messages newMessage={this.state.newMessage}/>
          {this.state.userTyping !== "" && <p className="typing-text"> {this.state.userTyping} is typing ...</p>}
          <form onSubmit={this.sendMessage}>
            <input ref={(input)=> this.input = input } onChange={this.sendTyping} autoComplete="off" />
            <button onClick={this.sendMessage} >Send</button>
          </form>
        </div>
      </app>
    );
  }
  sendTyping = (event) => {
      if (isTyping && event.target.value === "") {
          socket.emit('stopped typing', this.state.currentUser)
          isTyping = false
      } else if(!isTyping && event.target.value !== "") {
          socket.emit('user typing', this.state.currentUser)
          isTyping = true
      }
  }

  sendMessage = (event) => {
    event.preventDefault();
    socket.emit('chat message', this.input.value);
    socket.emit('stopped typing', this.state.currentUser)
    isTyping = false;
    let message = this.input.value;
    this.setState({newMessage: message})
    this.input.value = ''
  }
}

export default App;
