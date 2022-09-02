const fs = require('fs')
const { questionEmbed, turnChangeEmbed, endGameEmbed, loseHp, playAgain } = require('../reuse/games/forcaquestions')
const questions = JSON.parse(fs.readFileSync('./database/games/questions.json'))

module.exports = async (babe,GAME_INFO,client,message) => {
//variables
let questions = JSON.parse(fs.readFileSync('./dataBase/games/questions.json'))
let msgtoedit 
let counter = 0
let display = ''
let vidas = 6
let vidaDisplay
let reactions = ['✅','❌']
let toplay = []
let played = []
let temas = []
let opts = []
let discover = []
let possibilities = []
let jogadas = []
let players2 = []
for(let i = 0; i < GAME_INFO.players.length; i++){
    players2.push(GAME_INFO.players[i])
}
let NO_LOSE
let embed
let temaArray
let temp = [...GAME_INFO.players]
let tema
let randomPrashe
let prashe
let done
//gen question -> (temas, possibilities, temaArray, randomPrashe, opts, discover) -> [questions]
let newQuestion = () => {
    for(key in questions){
        possibilities.push(questions[key])
        temas.push(key)
    }
    let getRandom = () => {
        let randomTema = Math.floor(Math.random() * possibilities.length)
        temaArray = possibilities[randomTema]
        tema = temas[randomTema]
        randomPrashe = Math.floor(Math.random() * temaArray.length)
    }
    getRandom()
    prashe = temaArray[randomPrashe]
    
    for(let i = 0; i < prashe.length; i++){
        opts.push(prashe[i])
        if(prashe[i] == ' '){
            discover.push(' ')
        }else{
            discover.push('-')
        }
    }
}
//GAME SYSTEMS
let allDeath = async (win) => {
    let embed = playAgain(prashe, client.users.cache.get(message.author.id).username, win)
    let originalmsg = await message.channel.send({embeds:[embed]})
    for(let i = 0; i < reactions.length; i++){
        originalmsg.react(reactions[i]).catch(err => {})
    }
    const filter = (reaction, user) => {
        if(reactions.indexOf(reaction.emoji.name) !== -1 && user.id === (GAME_INFO.caller)){
            collected = reaction.emoji.name
            return true
        }
        return false
    };
    const collector = originalmsg.createReactionCollector({ filter, time: 30000, max:1 });
    collector.on('collect', (reaction, user) => {
        if(reaction.emoji.name === '✅'){
            reset()
            newQuestion()
            game()
        }
    })
    collector.on('end', collected => {
    });
}
let turn = async (x) => {
    if(toplay.length === 0){
        for(let i = 0; i < x.length; i++){
            toplay.push(x[i])
        }
        played = []
    }else{
        let removed = toplay.shift()
        played.push(removed)
        if(toplay.length === 0){
            for(let i = 0; i < x.length; i++){
                toplay.push(x[i])
            }
            played = []
        }
    }
}
let reset = () => {
display = ''
vidas = 6
vidaDisplay = ''
reactions = ['✅','❌']
toplay = []
played = []
temas = []
opts = []
discover = []
possibilities = []
temp = [...GAME_INFO.players]
jogadas = []
embed = ''
temaArray = ''
tema = ''
randomPrashe = ''
prashe = ''
done = ''
}
//GAME -> (response, done) -> [done, discover, jogadas, tema, response, opts]
let game = async () => {
    turn(temp)
    done = true
    display = ''
    let linha = 0
    vidaDisplay = ''
    for(let i = 0; i < vidas; i++){
        vidaDisplay = vidaDisplay + '♥'
    }
    for(let i = 0; i < discover.length; i++){
        if(discover[i] === ' '){
            display = display + `     [${linha}]\n> `
            linha = 0
        }else{
            linha++
            display = display + discover[i] + ' '
            if(i === discover.length - 1){
                display = display + `     [${linha}] `
            }
        }
    }
    embed = questionEmbed(tema, display, jogadas, vidaDisplay, vidas)
    await message.channel.send({embeds:[embed]}).catch(err => {})
    embed = turnChangeEmbed(await client.users.cache.get(toplay[0]).username)
    await message.channel.send({embeds:[embed]})
    const filter = m => {
        if(temp.indexOf(m.author.id) === -1) return false
        if(jogadas.indexOf(m.content) !== -1) return false
        if(toplay[0] !== m.author.id) return false
        response = m.content
        return true
    };
    message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] })
    .then(async collected => {
        if(response === '!chute'){
            message.channel.send({content:'Pode tentar acertar já, apenas uma chance.'})
            const filter = async (m) => {
                if(toplay[0] !== m.author.id) return false
                response = m.content
                return true
            };
            message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] })
            .then(async collected => {
                if(response.toLowerCase() === prashe.toLowerCase()){
                    embed = endGameEmbed(client.users.cache.get(toplay[0]).username, prashe)
                    message.channel.send({embeds:[embed]})
                    allDeath(true)
                }else{
                        let toRem = temp.indexOf(toplay[0])
                        let cut = temp.splice(toRem,1)
                    if(temp.length === 0){ 
                        allDeath()
                    }else{
                        message.channel.send({content:`que pena ta erradokkkkkkkkkkkkkk e ainda vou te tira do jogokkkkkkkk`})
                        game()
                    }
                }
            }).catch(collected => {
                message.channel.send('Acabou o tempo')
            });
        }else{
            let finder = false
            for(let i = 0; i < opts.length; i++){
                if(response === opts[i].toLowerCase() && jogadas.indexOf(response.toLowerCase()) === -1){
                    discover[i] = opts[i]
                    finder = true
                }
                if(discover[i].toLowerCase() !== opts[i].toLowerCase()){
                    done = false
                }
            }
            jogadas.push(response.toLowerCase())
            if(finder === false){
                vidas--
                if(vidas === 0){
                    allDeath()
                }else{
                    game()
                }
            }else{
                if(done === true){
                    embed = endGameEmbed(client.users.cache.get(toplay[0]).username, prashe)
                    message.channel.send({embeds:[embed]})
                }else{
                    game()
                }
            }
        }
    }).catch(collected => {
            console.log(collected)
            message.channel.send(`${client.users.cache.get(toplay[0]).username} demorou 60 segundos e o jogo finalizou aqui.`)
    });
}
newQuestion()
game()
}