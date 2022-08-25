const {MessageEmbed} = require('discord.js')
const { insight } = require('./functions')

this.error_embed = (motivo) => {
    insight(`erro: ${motivo}`)
    const embedtogo = new MessageEmbed()
    .setColor('#ff0000')
    .setFooter({ text: `❌ ops, ${motivo}`});
    return embedtogo
}
