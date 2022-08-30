const { QuestionEmbed, CorrectAnswer, GameOverEmbed} = require('./mathquestions.js')
const {EmbedBuilder, AttachmentBuilder} = require('discord.js')
const { error_embed } = require('../error-embed')


this.startGame = async (players, marcar, round, newquestion, message, questionmsg, response, userA_Name, userB_Name, points, level, pontos_userA, pontos_userB, userA, userB) => {
    for(let i = 0; i < players.length; players++){
        marcar = marcar + `<@${players[i]}>,`
    }
    questionmsg = await message.channel.send({content: `${marcar}`,embeds:[QuestionEmbed(round, newquestion.question, newquestion.level)]})
    
    const filter = m => {
        response = Number(m.content)
        correct = m
        if(response === newquestion.result && (m.author.id === userA || m.author.id === userB)) return true
        return false
    };

    questionmsg.channel.awaitMessages({ filter, max: 1, time: 20000 + level * 10000, errors: ['time'] })
    .then(collected => {
        if(correct.author.id === userA){
            pontos_userA += newquestion.result
        }
        if(correct.author.id === userB){
            pontos_userB += newquestion.result
        }
        points += newquestion.result
        round++
        message.channel.send({embeds:[CorrectAnswer(userA_Name, newquestion.result)]}).catch((err) => {return})
        .then(() => {
            let data = {
                "LEVEL_UP": false,
                "level": level,
                "GAME": true
            }
            if(round/10 === 1){
                data.level++
                data.LEVEL_UP = true
            }
            if(round/20 === 1){
                data.level++
                data.LEVEL_UP = true
            }
            return data
        })
    }).catch(collected => {
        console.log(collected)
        message.channel.send({embeds: [GameOverEmbed(newquestion.result,userA_Name, userB_Name, points, round, level, pontos_userA, pontos_userB)]})
    });
}