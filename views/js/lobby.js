// const socket = io()
socket.emit('join-req', {name, lobby})

const goAway = document.getElementById('goAway')
goAway.addEventListener('click', () => {
    document.getElementById('instructions').remove()
})

//TODO: make this your color
const colorInst = document.getElementById('colorInst')

//User List Stuff
const userList = document.getElementById('userList')
socket.on('user-list-change', ({users}) => {
    var html = ejs.render('<span> Players (<%= users.length %>): </span>', {users: users})
    var color, ready, temp
    var count = 0
    users.forEach( (user) => {
        color = `rgb(${user.color.r}, ${user.color.g}, ${user.color.b})`
        ready = user.ready ? '(ready)' : '(not ready)'
        html += ejs.render('<span style="color:<%= color %>"> <%= username + " " + ready %> </span>',
         {username: user.name, color: color, ready: ready})
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
    //let max = Math.max(style_height, style_width)

    canvas.setAttribute('height', style_height * dpi)
    canvas.setAttribute('width', style_width * dpi)
}

socket.on('count-down', ({count}) => {

    fix_dpi()
    ctx.fillStyle = 'white'
    ctx.font = '30px monospace'
    ctx.fillText(count, canvas.width/2, canvas.height/2)

})

socket.on('game-state-change', ({game}) => {

    const snakes = game.snakes
    const fruitPos = game.fruitPos

    fix_dpi()

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

    var snake, alive, r, g, b, fade
    for (var sid in snakes) {
        snake = snakes[sid]
        alive = snake.alive
        for (var i = 0; i < snake.body.length; i++) {
            fade = (5 * (snake.body.length - (i+1)))
            r = snake.color.r - fade >= 0 ? snake.color.r - fade : 0
            g = snake.color.g - fade >= 0 ? snake.color.g - fade : 0
            b = snake.color.b - fade >= 0 ? snake.color.b - fade : 0
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
            ctx.fillRect(sw * snake.body[i][1], sh * snake.body[i][0], sw, sh)
            if (!alive) {
                ctx.fillStyle = 'white'
                ctx.font = '15px monospace'
                ctx.fillText(':(', sw * snake.body[i][1] + 0.5 * sw, sh * snake.body[i][0] + 0.5 * sh)
            }
        }
    }

    ctx.strokeStyle = 'white'
    ctx.beginPath();
    ctx.arc(fruitPos[1] * sw + sw / 2, fruitPos[0] * sh + sh / 2, sw / 4, 0, 2 * Math.PI);
    ctx.stroke();



})

const dir = document.getElementById('dir')
//Handle key inputs
document.onkeydown = (e) => {

    e = e || window.event;
    var dirStr = 'none'
    var arrowKeys = false

    if (e.keyCode == '38') {
        e.preventDefault()
        dirStr = 'up'
    }
    else if (e.keyCode == '40') {
        e.preventDefault()
        dirStr = 'down'
    }
    else if (e.keyCode == '37') {
        e.preventDefault()
        dirStr = 'left'
    }
    else if (e.keyCode == '39') {
        e.preventDefault()
        dirStr = 'right'
    } else if (e.keyCode == '13') {
        chatSubmit.onclick()
    }

    if (dirStr !== 'none') {
        socket.emit('move', {dir: dirStr})
        dir.innerHTML = 'input: ' + dirStr
    }
}

//Chat Stuff
let chatSubmit = document.getElementById('chatSubmit')
let chatInput = document.getElementById('chatInput')
let chatBox = document.getElementById('chatBox')

chatSubmit.onclick = () => {
    var msg = chatInput.value
    if (msg !== '') {
        chatInput.value = ''
        socket.emit('send-message', {msg})
    }
}

socket.on('get-message', ({msg}) => {
    console.log(msg)
    let msgDiv = document.createElement("DIV")
    msgDiv.innerText = msg
    chatBox.appendChild(msgDiv)
    chatBox.scrollTop = chatBox.scrollHeight
})
