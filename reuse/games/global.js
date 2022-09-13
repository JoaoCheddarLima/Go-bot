const {EmbedBuilder} = require('discord.js')

const colors = {
    amarelo:"#adff2f",
    roxo:"#7600bc",
    azul:"0000FF",
    verde:"#00FF00",
    vermelho:"FF0000"
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