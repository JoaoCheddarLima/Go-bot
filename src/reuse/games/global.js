const {EmbedBuilder} = require('discord.js')

const colors = {
    amarelo:"#adff2f",
    roxo:"#7600bc",
    azul:"0000FF",
    verde:"#00FF00",
    vermelho:"FF0000"
}
this.quitEmbed = (username) => {
    const embedtogo = new EmbedBuilder()
    .setColor('FF0000')
    .setFooter({text: `❗ ${username} saiu!`});
    return embedtogo
}
this.PlayAgain = (username) => {
    text = `❓ Jogar novamente ${username}?\n🔸 [ ✅ Sim ] // [ ❌ Não ] 🔸`
    const embed = new EmbedBuilder()
    .setFooter({text:text})
    .setColor('000000')
    return embed
}

this.ImageEmbed = () => {
    const embed = new EmbedBuilder()
    .setColor('#000000')
    .setImage(`attachment://test.png`)
    return embed
}

this.collectReactions = (toplay, reactions, msg) => {
    let collected
    for(key of reactions){
        msg.react(key)
    }
    const filter = (reaction, user) => {
        if(reactions.indexOf(reaction.emoji.name) !== -1 && user.id === (toplay)){
            collected = reaction.emoji.name
            return true
        }
        return false
    };
    const collector = msg.createReactionCollector({ filter, time: 30000, max:1 });
    collector.on('collect', (reaction, user) => {
        return collected
    })
    collector.on('end', collected => {
    });
}