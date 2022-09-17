const {EmbedBuilder} = require('discord.js')

const colors = {
    amarelo:"#adff2f",
    roxo:"#7600bc",
    azul:"0000FF",
    verde:"#00FF00",
    vermelho:"FF0000"
}
this.notRegistered = () => {
    const embed = new EmbedBuilder()
    .setColor(colors.vermelho)
    .setFooter({text:'❌ Este não é um canal de jogos! ❌'})
    return embed
}

this.callAdmin = () => {
    const embed = new EmbedBuilder()
    .setColor(colors.amarelo)
    .setFooter({text:'❌ Ops, isso não é permitido aqui, contate um adm para que ele registre este canal utilizando g!reg'})
    return embed
}

this.notPermissions = () => {
    const embed = new EmbedBuilder()
    .setColor(colors.vermelho)
    .setFooter({text:'❌ Sem permissão para fazer isso!'})
    return embed
}

this.registerPrompt = (type) => {
    const embed1 = new EmbedBuilder()
    .setColor(colors.verde)
    .setFooter({text:'✅ Canal registrado, agora podemos jogar aqui!'})
    const embed2 = new EmbedBuilder()
    .setColor(colors.vermelho)
    .setFooter({text:'❌ Canal já está registrado, atualmente não há um comando para remover, porém pode entrar em contato com o suporte para remover'})
    return type === true? embed1 : embed2
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