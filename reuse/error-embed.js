const { EmbedBuilder} = require('discord.js')

this.error_embed = (motivo) => {
    const embedtogo = new EmbedBuilder()
    .setColor('#ff0000')
    .setFooter({ text: `❌ ops, ${motivo}`});
    return embedtogo
}

this.success_embed = (motivo) => {
    const embedtogo = new EmbedBuilder()
    .setColor('#00FF00')
    .setFooter({ text: `✅ ${motivo}`});
    return embedtogo
}