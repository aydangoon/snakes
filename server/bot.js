function Bot() {

    this.greet = (username) => {
        return `hey ${username}, welcome to the lobby! I'm SnakeB0t, type !help to see a list of commands.`
    }

    this.insult = (name) => {
        switch (Math.floor(Math.random() * 10)) {
            case 0: return 'The world is worse off thanks to ' + name + 's existance.'
            case 1: return name + ' is painfully bad.'
            case 2: return 'I would not invite ' + name + ' to my birthday party.'
            case 3: return 'Oof @' + name
            case 4: return name + ' is kinda trash.'
            case 5: return name + ' lacks redeemable qualities.'
            case 6: return name + ' is lame.'
            case 7: return 'forfeit ' + name + ', just forfeit.'
            case 8: return name + ' works for the government. '
            case 9: return 'HAHAHAHAHAHAHAHAHA ' + name + ' AHAHAHAHAHAHAHA'
        }
    }

    this.praise = (name) => {
        switch (Math.floor(Math.random() * 10)) {
            case 0: return 'The world is better off thanks to ' + name + 's existance.'
            case 1: return name + ' is painfully good.'
            case 2: return 'I would invite ' + name + ' to my birthday party.'
            case 3: return 'Nice @' + name
            case 4: return name + ' is kinda good.'
            case 5: return name + ' lacks unredeemable qualities.'
            case 6: return name + ' is epic.'
            case 7: return 'I forfeit ' + name + ', I just forfeit.'
            case 8: return name + ' works for the private sector. '
            case 9: return name + ' is a champion of epic proportions.'
        }
    }

    this.handleCommand = (cmdStr) => {

        let splCmd = cmdStr.split(' ')
        var cmdOpts = '[no options specified]'
        var cmd = splCmd[0]
        if (splCmd.length > 1) {
            cmdOpts = cmdStr.substring(cmdStr.indexOf(' ') + 1, cmdStr.length)
            console.log(cmdOpts)
        }

        switch (cmd) {

            case '!help':
                return 'Commands I understand right now: \n !insult [name] \n !praise [name] \n !punch [name] \n !dance \n !flip-table \n !instructions'
            case '!insult':
                return this.insult(cmdOpts)
            case '!praise':
                return this.praise(cmdOpts)
            case '!punch':
                return `(ง •̀_•́)=o(${cmdOpts})`
            case '!dance':
                return ' \n ᕕ(⌐■_■)ᕗ ♪♬ ᕕ(ᐛ)ᕗ ♪♬ \n ᕕ(ᐛ)ᕗ ♪♬ ᕕ(⌐■_■)ᕗ ♪♬  \n ᕕ(⌐■_■)ᕗ ♪♬ ᕕ(ᐛ)ᕗ ♪♬'
            case '!flip-table':
                return '(╯°□°）╯︵ ┻━┻'
            case '!instructions':
                return 'click the \"How to Play button\" bud.'
            default:
                return 'This is not a valid command my friend.'

        }

    }

}

module.exports = Bot
