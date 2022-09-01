const { EmbedBuilder } = require('discord.js')
const { error_embed } = require('../reuse/error-embed')
const { insight } = require('../reuse/functions')
const fs = require('fs')
module.exports = {
    name:'ajuda',
    async execute(message, input1, input2, userId){
        insight('ajuda')
        let data = JSON.parse(fs.readFileSync('package.json'))
        let version = data.version
        let erro = error_embed('Por algum motivo❓ não consegui responder sua mensagem 💔')
        const embed = new EmbedBuilder()
        .setFooter({text: `👋 Oi!! tudo bem?\n⭐Atualmente estou na versão: ${version}\n🌠Meu prefixo é: ${client.prefix}\n`})
        .setColor('7600bc')
        message.reply({embeds:[embed]}).catch((err) => {message.channel.send({content:`<@${userId}>`, embeds:[erro]}); insight(`erro: ${motivo}`)})
    }
}
