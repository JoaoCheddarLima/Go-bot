const {EmbedBuilder, AttachmentBuilder} = require('discord.js')
const colors = {
    amarelo:"#adff2f",
    roxo:"#7600bc",
    azul:"0000FF",
    verde:"#00FF00",
    vermelho:"FF0000"
}
this.winnerEmbed = (playerName, jogadas) => {
    const embed = new EmbedBuilder()
    .setColor(colors['vermelho'])
    .setFooter({text:`🎉 ${playerName} Venceu!!!🎉\n🎃 Jogadas: ${jogadas} 🎃`})
    return embed
}
this.drawEmbed = () => {
    const embed = new EmbedBuilder()
    .setColor('#000000')
    .setFooter({text:`💀 Não há mais jogadas disponiveis, deu velha 😫`})
    return embed
}
this.turnChangeEmbedVelha = (playerName, jogadas, attachment) => {
    attachment = attachment
    const embed = new EmbedBuilder()
    .setColor(colors['amarelo'])
    .setImage(`attachment://test.png`)
    .setFooter({text:`🌟 Vez de: ${playerName}\n🎈 [${jogadas}]`})
    return embed
}
this.findLocal = (choose) => {
    let pixels = {
        'y':{ 1:9, 2:56, 3:101 },
        'x':{ 1:9, 2:57, 3:105 }
    }
    let x
    let y
    let found = {x:0, y:0}
    if(choose > 3){
        x = 0
        y = 1
        while(choose > 3){
            choose -= 3
            y += 1 
        }
        while(choose > 0){
            choose -= 1
            x += 1
        }
        x = x === 0 ? 1 : x
        found['x'] = pixels['x'][x]
        found['y'] = pixels['y'][y]
    }else{
        found['x'] = pixels['x'][choose]
        found['y'] = pixels['y'][1]
    }
    return found
}
this.checkWin = (typo, tabuleiro) => {
    for(linha in tabuleiro[0]){
        if(tabuleiro[0,linha].every((e) => e === typo) === true) return true
    }
    for(let i = 0; i < 3; i++){
        let l1 = tabuleiro[0,0]
        let l2 = tabuleiro[0,1]
        let l3 = tabuleiro[0,2]
        if((l1[i] && l2[i] && l3[i]) === typo) return true
    }
    if(tabuleiro[1][1] === typo){
        let ev = 0
        let op = 2
        for(let i = 0; i < 2; i++){
            if((tabuleiro[0][ev] && tabuleiro[2][op]) === typo) return true
            ev +=2
            op -=2
        }
    }
    return false
}