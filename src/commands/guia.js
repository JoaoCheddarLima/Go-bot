const { EmbedBuilder } = require('discord.js')
const { error_embed, success_embed } = require('../reuse/error-embed')
const { insight } = require('../reuse/functions')
const fs = require('fs')
const { checkConfigs } = require('../reuse/config/config')
module.exports = {
    name:'guia',
    async execute(message,args, client, input1, input2, userId){
        let games = JSON.parse(fs.readFileSync('./src/dataBase/games/GamesDone.json'))
        let corrector = (s) => {
            return s.charAt(0).toUpperCase() + s.slice(1)
        }
        input1 = corrector(input1)
        if(games[input1] === undefined){
            return message.channel.send({embeds:[error_embed(`Nenhum jogo encontrado na sigla: "${input1}"`)]}).catch( err => {})
        }
        checkConfigs(userId, input1)
        const userConfigs = JSON.parse(fs.readFileSync('./src/reuse/config/userOptions.json'))
        let path = userConfigs[userId][input1]
        path === true ? userConfigs[userId][input1] = false : userConfigs[userId][input1] = true
        path = userConfigs[userId][input1]
        let wich = path => path === true? 'ativado' : 'desativado'
        message.channel.send({embeds:[success_embed(`Menu para "${input1}" ${wich(path)}`)]})
        fs.writeFileSync('./src/reuse/config/userOptions.json', JSON.stringify(userConfigs, null, 2));
    }
}
