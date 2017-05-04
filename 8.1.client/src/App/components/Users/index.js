import React, {Component} from 'react'
import socket from '~/src/socket'

class Users extends Component {
  render() {
    return (<ul className="user-sidebar">
      {this.state.users.map((user, index)=><li key={user.socketId} ><a href="#">{user.displayName}</a></li>)}
    </ul>)
  }
  constructor() {
    super()
    this.state = {
      users: []
    }
  }
  componentWillMount() {
    socket.on('update users', (userList) => {
      this.setState({
        users: userList
      })
    });
  }
}

export default Users
