const fs = require('fs')
const { addGamePoints } = require('../reuse/config/data')
const { insight } = require('../reuse/functions')
const { questionEmbed, turnChangeEmbed, endGameEmbed, loseHp, playAgain } = require('../reuse/games/forcaquestions')
const { quitEmbed } = require('../reuse/games/global')
const { JoinEmbed } = require('../reuse/games/mathquestions')
const { getRandom } = require('../reuse/games/forca-cfgs/system')

module.exports = async (babe,GAME_INFO,client,message) => {
insight('ForcaGame', true, 'games')
//variables
let questions = JSON.parse(fs.readFileSync('./src/dataBase/games/questions.json'))
let gone = []
let prashe
let temp = [...GAME_INFO.players]
let infos = {
    "acertos": 0,
    "jogos": 0
}
let reply = false
let msgtoedit 
let counter = 0
let display = ''
let oldturn
let vidas = 6
let vidaDisplay
let reactions = ['✅','❌']
let toplay = []
let opts = []
let discover = []
let jogadas = []
let tema
let embed
let done
//gen question -> (opts, discover) -> [questions]
let newQuestion = async () => {
    let gerar = await getRandom(questions)
    prashe = gerar['palavra']
    tema = gerar['tema']

    while(gone.indexOf(prashe) !== -1){
        gerar = await getRandom(questions)
        prashe = gerar['palavra']
        tema = gerar['tema']
    }

    for(let i = 0; i < prashe.length; i++){
        opts.push(prashe[i])
        if(prashe[i] == ' '){
            discover.push(' ')
        }else{
            discover.push('-')
        }
    }

    gone.push(prashe)
}
//GAME SYSTEMS
let allDeath = async (win) => {
    await msgtoedit.delete().catch(err => {})
    if(win === true){
        infos.acertos += 1
        infos.jogos += 1
    }
    for(key of GAME_INFO.players){
        addGamePoints(key, 'For', infos)
    }
    infos.acertos = 0
    let embed = playAgain(prashe, '', win)
    let originalmsg = await message.channel.send({embeds:[embed]})
    let nowplaying = []
    for(let i = 0; i < reactions.length; i++){
        await originalmsg.react(reactions[i]).catch(err => {})
    }
    const filter = async (reaction, user) => {
        if(reaction.emoji.name === '✅' && nowplaying.indexOf(user.id) == -1 ){
            collected = reaction.emoji.name
            return true
        }
        nowplaying.splice(nowplaying.indexOf(user.id), 1)
        await originalmsg.channel.send({embeds:[quitEmbed(`${client.users.cache.get(user.id).username}`)]})
        return false
    };

    const collector = originalmsg.createReactionCollector({ filter, time: 15000, max:10});
    collector.on('collect', async (reaction, user) => {
            await originalmsg.channel.send({embeds:[JoinEmbed(`${client.users.cache.get(user.id).username}`)]})
            nowplaying.push(user.id)
    })

    collector.on('end',async collected => {
        if(nowplaying.length === 0) return
        GAME_INFO.players = nowplaying
        reset()
        await newQuestion()
        await game()
    });
}

let turn = async (x) => {
        toplay.shift()
        if(toplay.length === 0){
            for(let i = 0; i < x.length; i++){
                toplay.push(x[i])
            }
        }
}
let reset = () => {
temp = GAME_INFO.players
display = ''
vidas = 6
vidaDisplay = ''
counter = 0
toplay = []
oldturn = ''
opts = []
discover = []
jogadas = []
embed = ''
}
//game instance
let game = async () => {
    await turn(temp)
    done = true

    //formata a frase gerada na questão gerando um display visual melhor
    display = ''
    vidaDisplay = ''
    for(let i = 0; i < vidas; i++){
        vidaDisplay = vidaDisplay + '♥'
    }
    for(let i = 0; i < discover.length; i++){
        if(discover[i] === ' '){
            //transforma em array p/ remover o ultimo elemento
            display = display.split('')
            display.pop()
            //transforma em string denovo
            display = String(display.reduce((x,y) => x += y,''))
            display = display + '・'
        }else{
            display = display + discover[i] + ' ' 
        }
    }

    embed = questionEmbed(tema, display, jogadas, vidaDisplay, vidas)

    if(counter === 3 || counter === 0){
        msgtoedit = await message.channel.send({embeds:[embed]}).catch(err => {})
        counter = 0
    }else{
        await msgtoedit.edit({embeds:[embed]
    })}

    embed = turnChangeEmbed(await client.users.cache.get(toplay[0]).username)
    oldturn = await message.channel.send({content: `||<@${toplay[0]}>||`,embeds:[embed]})

    const filter = async m => { 
        counter++
        if(counter === 6){
            let embed = questionEmbed(tema, display, jogadas, vidaDisplay, vidas)
            await msgtoedit.delete().catch(err => {})
            await oldturn.delete().catch(err => {})
            msgtoedit = await message.channel.send({embeds:[embed]}).catch(err => {})
            embed = turnChangeEmbed(await client.users.cache.get(toplay[0]).username)
            oldturn = await message.channel.send({content: `||<@${toplay[0]}>||`,embeds:[embed]})
            counter = 0
        }
        if(toplay[0] === m.author.id && m.content === '!chute'){
            await oldturn.delete().catch(err => {})
            await m.delete().catch(err => {})
            response = m.content
            counter === 1 ? counter = 1 : counter--
            return true
        }

        if( /^[a-z]+$/i.test(m.content) === false || m.content.length > 1) return false
        if(temp.indexOf(m.author.id) === -1) return false
        if(jogadas.indexOf(m.content.toLowerCase()) !== -1) return false
        if(toplay[0] !== m.author.id) return false
        
        response = m.content.toLowerCase()
        counter === 1 ? counter = 1 : counter--

        await m.delete().catch(err => {})
        await oldturn.delete()
        return true
    };

    message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] })
    .then(async collected => {
        reply = true
        if(response === '!chute'){

            message.channel.send({content:'Pode tentar acertar já, apenas uma chance.'})
            const filter = async (m) => {
                if(toplay[0] !== m.author.id) return false
                response = m.content
                return true
            };

            message.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ['time'] })
            .then(async collected => {
                if(response.toLowerCase() === prashe.toLowerCase()){
                    embed = endGameEmbed(client.users.cache.get(toplay[0]).username, prashe)
                    message.channel.send({embeds:[embed]})
                    allDeath(true)
                }else{
                    temp.splice(temp.indexOf(toplay[0]) , 1) //remove usuario que errou do recarregador de rodada
                    if(temp.length === 0){ 
                        allDeath()
                    }else{
                        message.channel.send({content:`que pena ta erradokkkkkkkkkkkkkk e ainda vou te tira do jogokkkkkkkk`})
                        game()
                    }
                }
            }).catch(collected => {
                message.channel.send('removido')
                temp.splice(temp.indexOf(toplay[0]) , 1) //remove usuario que errou do recarregador de rodada
                if(temp.length === 0){ 
                    allDeath()
                }else{
                    message.channel.send({content:`Jogador não responde e foi de F`})
                    game()
                }
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
                    allDeath(true)
                }else{
                    game()
                }
            }
        }
    }).catch(async collected => {
        console.log(collected)
        if(reply === false){
            await message.channel.send(`por falta de resposta ${client.users.cache.get(toplay[0]).username} foi removido.`)
            temp.splice(temp.indexOf(toplay[0]),1)
            if(temp.length === 0){
                allDeath()
                return
            }else{
                game()
            }
        }
        reply = false
    });
}
await newQuestion()
game()
}