const { EmbedBuilder } = require('discord.js') 

this.removePlayer = (player,players) => {
    players.splice(players.indexOf(player), 1)
    return players
}

this.luckyNot = (x) => {
    let randomOut = ['A sorte não estava com esta alma', 'O fim dele foi aqui', 'Quem vai limpar isso?', 'Não foi desta vez', 'Menos um']
    let randomStill = ['Quase...', 'Top 5 pessoas que até o diabo tem medo', 'oof... nem você acreditou', 'O proximo não vai ter a mesma sorte']
    const m1 = `💀 Morreu! ${randomOut[Math.floor(Math.random() * randomOut.length)]}`
    const m2 = `❗ Continua vivo! ${randomStill[Math.floor(Math.random() * randomStill.length)]}`
    let text = x === true? m1 : m2
    let color = x === true? '#FF0000' : 'FFFFFF'
    const embed = new EmbedBuilder()
    .setColor(color)
    .setFooter({text:text})
    return embed
}

this.atirar = (tambor, slot) => {
    if(tambor[slot] === true){
        return true
    }else{
        return false
    }
}

this.turn = (player) => {
    const embed = new EmbedBuilder()
    .setColor('#FF0000')
    .setFooter({text:`🎃 ${player}, vai Rodar 🔀, ou vai atirar? 🔫`})
    return embed
}

this.shuffling = () => {
    const embed = new EmbedBuilder()
    .setColor('#000000')
    .setFooter({text:`📌 Rodando o tambor... Assim que acabar você vai instaneamente atirar...💥\n🎃 Boa sorte, vai precisar.. 🎃`})
    return embed
}

this.shoot = (player) => {
    const embed = new EmbedBuilder()
    .setColor('#adff2f')
    .setFooter({text:`❗ ${player} está se preparando para atirar...`})
    return embed
}

this.russaEnd = (player, prize) => {
    const embed = new EmbedBuilder()
    .setColor('#FFFFFF')
    .setFooter({text:`🔸 ${player} Foi o ultimo a sobrar, Ficou com a premiação de: 💲${prize},00`})
    return embed
}
