var { io } = require('../app.js')
var User = require('./user.js')
var Game = require('./game.js')

//Lobby Class
function Lobby(name) {

    this.users = {}
    this.numUsers = 0
    this.game = undefined
    this.tickClock = undefined
    this.name = name

    this.addUser = (userId, username) => {

        var user = new User(username, this.numUsers + 1)
        this.users[userId] = user

        this.numUsers++

        console.log('*USER ADDED* users state: ', this.users)

    }

    //invariant: only called when room has that user
    this.removeUser = (userId) => {

        const num = this.users[userId].num
        for (var uid in this.users) {
            if (this.users[uid].num > num) {
                this.users[uid].num--
            }
        }

        delete this.users[userId]
        this.numUsers--

        console.log('*USER REMOVED* users state:', this.users)

    }

    this.sendGameChangesToClient = () => {

        this.game.updateState()
        io.to(this.name).emit('game-state-change', {game: this.game})

        if (this.game.isOver || this.numUsers == 0) {
            clearInterval(this.tickClock)
            io.to(this.name).emit('game-over', {winner: this.game.winner})
        }
        //console.log('game tick for lobby:', this.name)
    }

    this.startGame = () => {

        for (var uid in this.users) {
            this.users[uid].ready = false
        }

        this.game = new Game(this.users, this.numUsers)
        
        io.to(this.name).emit('game-state-change', {game: this.game})
        this.tickClock = setInterval(this.sendGameChangesToClient, 500)

    }

    this.setReady = (userId, on) => {

        this.users[userId].ready = on

        for (var uid in this.users) {
            if (!this.users[uid].ready) {
                console.log('lobby not ready')
                return //TODO add functionality
            }
        }
        console.log('lobby starting')
        this.startGame()
        io.to(this.name).emit('game-start')

    }

    //Nice helper functions
    this.getUserList = () => {
        var arr = []
        for (var uid in this.users) {
            arr.push(this.users[uid])
        }
        return arr
    }
}

module.exports = Lobby
