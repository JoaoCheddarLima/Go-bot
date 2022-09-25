const { EmbedBuilder } = require('discord.js')
const { error_embed } = require('../reuse/error-embed')
const { insight } = require('../reuse/functions')
const fs = require('fs')
const { buttonURL } = require('../reuse/config/buttons')
module.exports = {
    name:'ajuda',
    async execute(message,args, client, input1, input2, userId){
        insight('Support')
        let url = 'https://discord.gg/WaeXPWY7Ry'
        let data = JSON.parse(fs.readFileSync('package.json'))
        let version = data.version
        let erro = error_embed('Por algum motivo❓ não consegui responder sua mensagem 💔')
        let motivo = 'slakkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk'

        let config = {
            text:'Servidor de suporte',
            url:url
        }

        const embed = new EmbedBuilder()
        .setFooter({text: `👋 Oi!! tudo bem?\n⭐Atualmente estou na versão: ${version}\n🌠Meu prefixo é: ${client.prefix}\n`})
        .setColor('7600bc')
        message.reply({
            components:[buttonURL(config)],
            embeds:[embed]
        })
        .catch((err) => {
            message.channel.send({content:`<@${userId}>`, embeds:[erro]});
            insight(`erro: ${motivo}`); 
            console.log(err)
        })
    }
}
