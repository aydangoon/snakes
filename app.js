var express = require('express')
var bp = require('body-parser')
var app = express()

var server = require('http').createServer(app)

var urlEncodedParser = bp.urlencoded({ extended: false })

app.set('view engine', 'ejs')

app.use(express.static('views'))

app.get('/', (req, res) => {
    res.render('index', {qs: req.query})
})

// app.get('/lobby', (req, res) => {
//     res.send('error: you did not join a lobby.')
// })

app.post('/lobby', urlEncodedParser, (req, res) => {
    res.render('lobby', {data: req.body})
})

const PORT = process.env.PORT || 8080 //8080 when uploading files to gcloud
server.listen(PORT, () => {
    //console.log('server started')
})

var io = require('socket.io')(server)
exports.io = io

var Lobby = require('./server/lobby.js')
var lobbies = {}
var lobbyOf = {}

io.on('connection', (socket) => {
    //console.log('new socket with id:', socket.id)

    //Join Request
    socket.on('join-req', ({name, lobby}) => {
        //console.log('socket with id:', socket.id, 'wants to join lobby:',
        // lobby, 'with username:', name)

        if (!lobbies.hasOwnProperty(lobby)) {
            lobbies[lobby] = new Lobby(lobby)
        }

        lobbies[lobby].addUser(socket.id, name)
        lobbyOf[socket.id] = lobby
        socket.join(lobby)

        io.to(lobby).emit('user-list-change', { users: lobbies[lobby].getUserList() })

    })

    //Checkbox clicked
    socket.on('checkbox-click', ({on}) => {

        let lobbyName = lobbyOf[socket.id]
        if (lobbies.hasOwnProperty(lobbyName)) {
            lobbies[lobbyName].setReady(socket.id, on)
            io.to(lobbyName).emit('user-list-change', { users: lobbies[lobbyName].getUserList() })
        }

    })

    //Move
    socket.on('move', ({dir}) => {
        //console.log('key input registered')
        let lobbyName = lobbyOf[socket.id]
        if (lobbies[lobbyName].game !== undefined) {
            lobbies[lobbyName].game.changeDir(socket.id, dir)
        }
    })

    socket.on('disconnect', (reason) => {
        //console.log('socket with id:', socket.id, 'disconnected because', reason)
        if (lobbyOf.hasOwnProperty(socket.id)) {
            var lobbyName = lobbyOf[socket.id]
            var lobby = lobbies[lobbyName]
            lobby.removeUser(socket.id)
            socket.leave(lobbyName)
            io.to(lobbyName).emit('user-list-change', { users: lobby.getUserList() })
            if (lobby.numUsers == 0) {
                delete lobbies[lobbyName]
            }
        }
    })

})
