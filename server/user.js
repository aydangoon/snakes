function User(name, color) {
    this.name = name
    this.color = color
    this.ready = false

    this.sameColor = (color) => {
        return Math.abs(color.r-this.color.r) + Math.abs(color.g - this.color.g) + Math.abs(color.b - this.color.b) < 60
    }
}

module.exports = User
