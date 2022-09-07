const {EmbedBuilder} = require('discord.js')

const colors = {
    amarelo:"#adff2f",
    roxo:"#7600bc",
    azul:"0000FF",
    verde:"#00FF00",
    vermelho:"FF0000"
}
let cores = ['amarelo','roxo','azul','verde','vermelho']

this.questionEmbed = (tema, display, jogadas, vidaDisplay, vida) => {
    const embed = new EmbedBuilder()
    .setColor(colors['amarelo'])
    .setDescription(`♦ Tema: ${tema}♦\n🎈Letras já usadas: [${jogadas}]\n\n> ${display}\n\n🔸Tentativas: [${vidaDisplay}] - ${vida}/6`)
    .setFooter({text:'📌 Em breve: Temas da comunidade'})
    return embed
}

this.endGameEmbed = (playerName,  prashe) => {
    const embed = new EmbedBuilder()
    .setColor(colors['verde'])
    .setDescription(`🔸 ${playerName} Acertou! 🔸\n🎯 - "${prashe}"`)
    .setFooter({text:`📌 Será que pesquisou no google? 💀`})
    return embed
}

this.turnChangeEmbed = (playerName) => {
    const embed = new EmbedBuilder()
    .setColor(colors['amarelo'])
    .setFooter({text:`🌟 Vez de: ${playerName}\n🎈 Escreva "!chute" se já souber ou quiser tentar acertar`})
    return embed
}

this.loseHp = (vidas) => {
    const embed = new EmbedBuilder()
    .setFooter({text:`💔 -> 💥 Perdeu uma chance, restante: ${vidas}`})
    .setColor(colors['vermelho'])
    return embed
}

this.playAgain = (prashe, username, win) => {
    let text = `💀 A resposta era: ${prashe}\n❓ Jogar novamente ${username}?\n🔸 [ ✅ Sim ] // [ ❌ Não ] 🔸`
    if(win === true){
        text = `❓ Jogar novamente ${username}?\n🔸 [ ✅ Sim ] // [ ❌ Não ] 🔸`
    }
    const embed = new EmbedBuilder()
    .setFooter({text:text})
    .setColor('000000')
    return embed
}