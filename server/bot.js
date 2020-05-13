function Bot() {

    this.greet = (username) => {
        return `hey ${username}, welcome to the lobby! I'm SnakeB0t, type !help to see a list of commands.`
    }

    this.handleCommand = (cmdStr) => {

        let splCmd = cmdStr.split(' ')
        var cmdOpts = '[no options specified]'
        var cmd = splCmd[0]
        if (splCmd.length > 1) {
            cmdOpts = cmdStr.substring(cmdStr.indexOf(' '), cmdStr.length)
            console.log(cmdOpts)
        }

        switch (cmd) {

            case '!help':
                return 'Here are the commands I understand right now: \n !insult [name] \n !praise [name] \n !instructions'
            case '!insult':
                if (cmdOpts.length > 0) {
                    return `${cmdOpts} is an uncouth bastard.`
                }
                return 'Yoshi is an uncouth bastard.'
            case '!praise':
                if (cmdOpts.length > 0) {
                    return `${cmdOpts} is a great guy.`
                }
                return 'Yoshi is a great guy.'
            case '!instructions':
                return 'click the \"How to Play button\" lol'
            default:
                return 'This is not a valid command my friend.'

        }

    }

}

module.exports = Bot
