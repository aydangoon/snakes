// const socket = io()
socket.emit('join-req', {name, lobby})

//User List Stuff
const userList = document.getElementById('userList')
socket.on('user-list-change', ({users}) => {
    var html = ejs.render('<h3> Players (<%= users.length %>): </h3>', {users: users})
    var color, ready, temp
    var count = 0
    users.forEach( (user) => {
        temp = ((user.num-1) / users.length)
        color = `rgb(${ 55 + temp * 200}, ${ 155 + temp * 100}, ${ 255 - temp * 200})`
        ready = user.ready ? '✔' : 'x'
        html += ejs.render('<span style="color:<%= color %>"> <%= num + ") " + username + ": " + ready + " " %> </span>',
         {num: user.num, username: user.name, color: color, ready: ready})
        count++
        if (count % 6 == 0) {
            count = 0
            html += ejs.render('<br />')
        }
    })
    userList.innerHTML = html
})

//Checkbox Stuff
const checkbox = document.getElementById('checkbox')
checkbox.addEventListener('click', (e) => {
    socket.emit('checkbox-click', {on: checkbox.checked})
})


//Game Over stuff
var outcome = document.getElementById('outcome')
socket.on('game-over', ({winner}) => {
    outcome.innerHTML = winner + ' wins! check the ready box to play again.'
    checkbox.disabled = false
})
socket.on('game-start', () => {
    outcome.innerHTML = ''
    checkbox.checked = false
    checkbox.disabled = true
})


//Canvas stuff
let canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')
let dpi = window.devicePixelRatio

function fix_dpi() {
    //get CSS height
    //the + prefix casts it to an integer
    //the slice method gets rid of "px"
    let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2)
    //get CSS width
    let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2)
    //scale the canvas
    canvas.setAttribute('height', style_height * dpi)
    canvas.setAttribute('width', style_width * dpi)
}

socket.on('game-state-change', ({game}) => {
    fix_dpi()
    //console.log('recieved game tick')
    var sw = (canvas.width / game.board.length)
    var sh = (canvas.height / game.board.length)

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.lineWidth = 1
    ctx.strokeStyle = 'rgb(100, 200, 50)'

    for (var r = 0; r < game.board.length + 1; r++) {
        ctx.beginPath()
        ctx.moveTo(0, sh * r)
        ctx.lineTo(canvas.width, sh * r)
        ctx.stroke()
    }

    for (var c = 0; c < game.board.length + 1; c++) {
        ctx.beginPath()
        ctx.moveTo(sw * c, 0)
        ctx.lineTo(sw * c, canvas.height)
        ctx.stroke()
    }
    var red, green, blue, maxRGB, minRGB, cr, cg, cb
    ctx.font = `${sh}px monospace`;
    for (var r = 0; r < game.board.length; r++) {
        for (var c = 0; c < game.board.length; c++) {

            if (game.board[r][c] > 0) {

                var temp = ((game.board[r][c]-1) / game.numSnakes)
                red = 55 + temp * 200
                green = 155 + temp * 100
                blue = 255 - temp * 200
                maxRGB = Math.max(red, green, blue)
                minRGB = Math.min(red, green, blue)

                ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`
                ctx.fillRect(sw*c, sh*r, sw, sh)

                cr = maxRGB + minRGB - red
                cg = maxRGB + minRGB - green
                cb = maxRGB + minRGB - blue

                ctx.fillStyle = `rgb(${cr}, ${cg}, ${cb})`
                ctx.fillText(game.board[r][c], sw*c + sw / 4, sh*r + (3 * sh / 4))

            } else if (game.board[r][c] == -1) {
                ctx.strokeStyle = 'white'
                ctx.beginPath()
                ctx.arc(sw*c + (sw / 2), sh*r + (sh / 2), sw / 4, 0, 2 * Math.PI)
                ctx.stroke()
            }
        }
    }

})

//Handle key inputs
document.onkeydown = (e) => {

    e = e || window.event;

    if (e.keyCode == '38') {
        e.preventDefault()
        socket.emit('move', {dir: 'up'})
    }
    else if (e.keyCode == '40') {
        e.preventDefault()
        socket.emit('move', {dir: 'down'})
    }
    else if (e.keyCode == '37') {
        e.preventDefault()
        socket.emit('move', {dir: 'left'})
    }
    else if (e.keyCode == '39') {
        e.preventDefault()
        socket.emit('move', {dir: 'right'})
    }
}
