const { addGroupMoney } = require('../economy/utils/ecoManager.js')
const { addGamePoints } = require('../reuse/config/data.js')
const { insight } = require('../reuse/functions.js')
const { GenQuestions, QuestionEmbed, CorrectAnswer, GameOverEmbed, PauseEmbed, LevelUpEmbed} = require('../reuse/games/mathquestions.js')
module.exports = async (players,GAME_INFO,client,message) => {
    insight('MathGame2', true, 'games')
let tabela_pontos = {}
let questionmsg
let correct
let response
let points = 0
let LEVEL_UP = false
let level = 1
let round = 1 
let infos = {
    points: 0,
    level: 0,
    jogos: 1,
    rounds: 0
}
let gameGen = async () => {    
    let newquestion = GenQuestions(level, 'mult')

        if(round === 1){
            for(key of players){
                tabela_pontos[`${key}`] = {
                    username: await client.users.cache.get(key).username,
                    points: 0
                }
            }
            GAME_INFO.end = tabela_pontos
        }

    let game = async () => {
        let marcar = ''
        for(let i = 0; i < players.length; i++){
            marcar = marcar + `<@${players[i]}>,`
        }
        questionmsg = await message.channel.send({content: `||${marcar}||`,embeds:[QuestionEmbed(round, newquestion.question, newquestion.level)]})
        
        const filter = m => {
            response = Number(m.content)
            let IS_PLAYER = false
            correct = m
            for(let i = 0; i < players.length; i++){
                if(players[i] === m.author.id){
                    IS_PLAYER = true
                    break
                }
            }
            if(response === newquestion.result && IS_PLAYER === true) return true
            return false
        };

        questionmsg.channel.awaitMessages({ filter, max: 1, time: 20000 + level * 10000, errors: ['time'] })
        .then(async collected => {
            await questionmsg.delete().catch(err => {})
            tabela_pontos[correct.author.id].points += newquestion.result
            points += newquestion.result
            round++
            message.channel.send({embeds:[CorrectAnswer(client.users.cache.get(correct.author.id).username, newquestion.result)]}).catch((err) => {return})
            .then(() => {
                if(round/10 === 1){
                    level++
                    LEVEL_UP = true
                }
                if(round/20 === 1){
                    level++
                    LEVEL_UP = true
                }
            })
            .then(() => gameGen())
        }).catch(async collected => {
            await questionmsg.delete().catch(err => {})
            for(key in tabela_pontos){
                infos.level = level
                infos.points = tabela_pontos[key][points]
                infos.rounds = round
                addGamePoints(key,'Mul',infos)
            }
            await message.channel.send({embeds: [GameOverEmbed(newquestion.result, points, round, level, GAME_INFO),await addGroupMoney(tabela_pontos, 8)]})
        });
    }
        if(round > 1){
            let tempo = 3000 + level * 2000
            let PAUSE_EMBED = await message.channel.send({embeds:[PauseEmbed(tempo)]})
            if(LEVEL_UP === true){
                await message.channel.send({embeds:[LevelUpEmbed(level)]})
                LEVEL_UP = false
            }
            setTimeout(() => {
                PAUSE_EMBED.delete().catch((err) => {})
                game()
            }, tempo)
        }else{
            game()
        }
    }
    gameGen()
}