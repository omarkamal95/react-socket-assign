let userNumber = 1;
let users = [];
module.exports = io => {
    io.on('connection', function(socket) {

        let nickname = 'user' + userNumber;
        let user = {
            nickname,
            id: socket.id
        }
        userNumber++;
        console.log(user.nickname + ' connected')
        users.push(user);
        io.emit('update users', users)

        socket.emit('current user', user)

        socket.on('disconnect', function() {
            for (let i = 0; i < users.length; i++) {
                if (users[i].id === socket.id) {
                    console.log(user.nickname + ' disconnected');
                    users.splice(i, 1);
                }
            }
        })

        socket.on('chat message', function(msg) {
            socket.broadcast.emit('chat message', msg);
        })

        socket.on('user typing', function(user) {
            socket.broadcast.emit('user typing', user);
        })

        socket.on('stopped typing', function(user) {
            socket.broadcast.emit('stopped typing', user);
        })


    })
}
