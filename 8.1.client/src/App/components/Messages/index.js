import React, {Component} from 'react'
import socket from '~/src/socket'

class Messages extends Component {
  render() {
    return (<ul>
      {this.state.messages.map((message, index)=><li key={index} ><strong>{message.displayName}: </strong>{message.message}</li>)}
    </ul>)
  }
  constructor() {
    super()
    this.state = {
      messages: []
    }
  }
  componentWillMount() {
    let thisState = this;
    let firebase = this.props.fireBase;
    firebase.database().ref('messages').once('value').then(function(snapshot) {
                snapshot.forEach(function(childSnap){
                   console.log("lolololol MESSAGE ", childSnap.val());
                   thisState.setState(prevState=>{
                       return { messages: prevState.messages.concat(childSnap.val()) }
                  })
               })
                
     });
    socket.on('chat message', (msg) => {
      this.setState(prevState=>{
        return {
          messages: prevState.messages.concat(msg)
        }
      })
    });
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.newMessage !== this.props.newMessage){
      this.setState(prevState=>{
        return {
          messages: prevState.messages.concat(nextProps.newMessage)
        }
      })
  }
    if(this.props.prevMessage !== nextProps.prevMessage){
      console.log("WEESELLL ", nextProps.prevMessage)
        this.setState({
          messages: nextProps.prevMessage
        })
    }
  }
}

export default Messages
