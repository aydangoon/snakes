function Snake(name, initPos, color) {

    this.name = name
    this.color = color
    this.dir = [0, 1]
    this.lastDir = [0, 1]
    this.body = [initPos]
    this.alive = true

    this.setDir = (strDir) => {
        switch(strDir) {
            case 'left':
                if (this.body.length == 1 || !(this.lastDir[1] == 1)) {
                    this.dir = [0, -1]
                }
                break
            case 'right':
                if (this.body.length == 1 || !(this.lastDir[1] == -1)) {
                    this.dir = [0, 1]
                }
                break
            case 'down':
                if (this.body.length == 1 || !(this.lastDir[0] == -1)) {
                    this.dir = [1, 0]
                }
                break
            case 'up':
                if (this.body.length == 1 || !(this.lastDir[0] == 1)) {
                    this.dir = [-1, 0]
                }
                break
        }
    }
}

function Game(users, numUsers) {

    //Constructor
    this.isOver = false
    this.winner = 'nobody'
    this.numSnakes = numUsers
    this.numAlive = numUsers
    this.fruitPos = [0, 0]

    this.board = []
    for (var r = 0; r < 8 * numUsers; r++) {
        this.board.push([])
        for (var c = 0; c < 8 * numUsers; c++) {
            this.board[r].push(0)
        }
        //console.log(this.board[r])
    }

    this.pickEmptySpot = (cutoff) => {
        var x, y
        do {
            x = Math.floor(Math.random()*cutoff)
            y = Math.floor(Math.random()*cutoff)
            //console.log('testing:', [x, y])
        } while (this.board[x][y] != 0)
        return [x, y]
    }

    //Set the initial fruit
    this.putFruit = () => {

        var randPos = this.pickEmptySpot(this.board.length)
        //console.log('FRUIT MOVED', randPos)
        //console.log('BOARD')

        for (var i = 0; i < this.board.length; i++) {
            var abc = ''
            for(var j = 0; j < this.board.length; j++) {
                abc += this.board[i][j]
            }
            //console.log(abc)
        }
        this.fruitPos = randPos
        this.board[randPos[0]][randPos[1]] = -1

    }

    this.putFruit()

    this.snakes = {}
    for (var uid in users) {
        var randPos = this.pickEmptySpot(this.board.length - 2)
        this.snakes[uid] = new Snake(users[uid].name, randPos, users[uid].color)
        this.board[randPos[0]][randPos[1]] = 1
        //console.log(this.snakes[uid])
    }

    this.updateState = () => {

        //remove the snake tails
        for (var id in this.snakes) {
            var snake = this.snakes[id]
            if (snake.alive) {
                var tail = snake.body[0]
                this.board[tail[0]][tail[1]] = 0
            }
        }

        var foundFruit = {}
        var fruitToBeMoved = false
        //move the snakes, killing the ones who run into stuff
        for (var id in this.snakes) {
            var snake = this.snakes[id]
            if (snake.alive) {
                var oh = snake.body[snake.body.length - 1]
                var nh = [oh[0] + snake.dir[0], oh[1] + snake.dir[1]]
                snake.lastDir = snake.dir
                if (nh[0] < 0 || nh[1] < 0 || nh[0] >= this.board.length || nh[1] >= this.board.length || this.board[nh[0]][nh[1]] == 1) {
                    snake.alive = false
                    this.numAlive--
                } else {
                    snake.body.push(nh)
                    foundFruit[id] = this.board[nh[0]][nh[1]] == -1
                }
            }
        }

        //filling the board with the new head appropriate colors
        for (var id in this.snakes) {
            var snake = this.snakes[id]
            var tail = snake.body[0]
            if (snake.alive) {
                var head = snake.body[snake.body.length - 1]
                this.board[head[0]][head[1]] = 1

                if (!foundFruit[id]){
                    snake.body.shift()
                } else {
                    this.board[tail[0]][tail[1]] = 1
                    fruitToBeMoved = true
                }

            } else {
                this.board[tail[0]][tail[1]] = 1
            }
        }

        if (fruitToBeMoved) {
            this.putFruit()
        }

        if (this.numAlive < 2) {
            this.isOver = true
            for (var id in this.snakes) {
                if (this.snakes[id].alive) {
                    this.winner = this.snakes[id].name
                }
            }
        }

    }

    this.changeDir = (userId, strDir) => {
        if (this.snakes.hasOwnProperty(userId)) {
            this.snakes[userId].setDir(strDir)
        }
    }
}

module.exports = Game
