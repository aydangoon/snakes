function Bot() {

    this.greet = (username) => {
        return `hey ${username}, welcome to the lobby! I'm SnakeB0t, type !help to see a list of commands.`
    }

    this.handleCommand = (cmdStr) => {

        let splCmd = cmdStr.split(' ')
        var cmdOpts = []
        var cmd = splCmd[0]
        if (splCmd.length > 1) {
            cmdOpts = splCmd.slice(1, splCmd.length)
        }

        switch (cmd) {

            case '!help':
                return 'Currently the only command you can do is !insult [name], but do not do that.'
            case '!insult':
                if (cmdOpts.length > 0) {
                    return `${cmdOpts[0]} is an uncouth bastard.`
                }
                    return 'Yoshi is an uncouth bastard.'
            default:
                return 'This is not a valid command my friend.'

        }

    }

}

module.exports = Bot
