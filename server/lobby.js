var { io } = require('../app.js')
var User = require('./user.js')
var Game = require('./game.js')
var Bot = require('./bot.js')

//Lobby Class
function Lobby(name) {

    this.users = {}
    this.numUsers = 0
    this.game = undefined
    this.tickClock = undefined
    this.countDownClock = undefined
    this.countDownNum = 5
    this.name = name
    this.bot = new Bot()

    this.addUser = (userId, username) => {

        var color, uniqueColor
        do {

            color = {r: 50 + 10*(Math.floor(Math.random()*20)),
                g: 50 + 10*(Math.floor(Math.random()*20)), b: 50 + 10*(Math.floor(Math.random()*20))}
            uniqueColor = true

            for (var uid in this.users) {
                if (this.users[uid].sameColor(color)) {
                    uniqueColor = false
                }
            }
        } while (!uniqueColor)

        let notUniqueCount = 1
        for (var uid in this.users) {
            if (this.users[uid].name === username) {
                notUniqueCount++
            }
        }
        if (notUniqueCount > 1) {
            username += notUniqueCount
        }
        var user = new User(username, color)

        this.users[userId] = user

        this.numUsers++

        let msg = 'SnakeB0t: ' + this.bot.greet(username)
        io.to(userId).emit('get-message', ({msg}))

        console.log('*USER ADDED* users state: ', this.users)

    }

    //invariant: only called when room has that user
    this.removeUser = (userId) => {

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

        io.to(this.name).emit('count-down', {count: this.countDownNum})
        this.countDownNum--

        this.countDownClock = setInterval(this.countDown, 1000)

    }

    this.countDown = () => {

        io.to(this.name).emit('count-down', {count: this.countDownNum})

        if (this.countDownNum == 0) {
            clearInterval(this.countDownClock)
            this.countDownNum = 6
            io.to(this.name).emit('game-state-change', {game: this.game})
            this.tickClock = setInterval(this.sendGameChangesToClient, 300)
        }

        this.countDownNum--

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

    this.handleMessage = (userId, msg) => {

        let name = this.users[userId].name
        io.to(this.name).emit('get-message', {msg: name + ': ' + msg})

        if (msg.substring(0, 1) === '!') {
            let botMsg = this.bot.handleCommand(msg)
            io.to(this.name).emit('get-message', {msg: 'SnakeB0t: ' + botMsg})
        }

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
