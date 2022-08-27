const { EmbedBuilder } = require('discord.js')
const { error_embed } = require('../reuse/error-embed')
const { insight } = require('../reuse/functions')

module.exports = {
    name:'ajuda',
    async execute(message, input1, input2, userId, input3, input4){
        insight('ajuda')
        let erro = error_embed('Por algum motivo❓ não consegui responder sua mensagem 💔')
        let version = '1.0.0'
        let prefix = 'g!'
        const embed = new EmbedBuilder()
        .setFooter({text: `👋 Oi!! tudo bem?\n⭐Atualmente estou na versão: ${version}\n🌠Meu prefixo é: ${prefix}\n`})
        .setColor('7600bc')
        message.reply({embeds:[embed]}).catch((err) => {message.channel.send({content:`<@${userId}>`, embeds:[erro]}); insight(`erro: ${motivo}`)})
    }
}
