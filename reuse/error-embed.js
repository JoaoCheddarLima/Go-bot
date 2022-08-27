const { EmbedBuilder} = require('discord.js')

this.error_embed = (motivo) => {
    const embedtogo = new EmbedBuilder()
    .setColor('#ff0000')
    .setFooter({ text: `❌ ops, ${motivo}`});
    return embedtogo
}
