const fs = require('fs')
const input = require('readline-sync')
const Games = JSON.parse(fs.readFileSync('../../dataBase/games/GamesDone.json'))
let text = ''
let shortcut = ''
let choose = ''
let x = 1
let playable = ['all', 'solo', 'duo', 'grupo']
const colors = {
    amarelo:"#adff2f",
    roxo:"#7600bc",
    azul:"0000FF",
    verde:"#00FF00",
    vermelho:"FF0000"
}
const NewGame = {
    nome:"",
    guideText:"",
    cor:"",
    playableModes:"",
    shorcut:""
}
////
NewGame.nome = input.question('\nNome do jogo (para display)\nR:')
text = text + `👾 ${NewGame.nome} 👾\n\n⏰ Começa em 15 segundos⏰\n\n❓ Como jogar ❓\n♦`
text = text + input.question('\nDigite o que o bot irá fazer pra poder jogar o jogo\nR:')
text = text + '♦\n♦'
text = text + input.question('\nQuanto tempo para responder?\nR:')
text = text + '♦\n♦'
text = text + input.question('\nComo o jogo acaba?\R:')
text = text + '♦'
NewGame.guideText = text
////
let chooseColor = ()=>{
    choose = input.question('Qual será a cor da embed?\nR:')
    if(colors[choose] === undefined){
        text = 'Cores disponiveis:\n'
        for(key of colors){
            text = text + `[${key}]\n`
        }
        console.log(text)
        chooseColor()
    }
    NewGame.cor = colors[choose]
}
chooseColor()
////
for(let i = 0; i < 3; i++){
    let nome = NewGame.nome
    shortcut = shortcut + nome[i]
}
NewGame.shorcut = shortcut
///
text = ''
for(let i = 0; i < playable.length; i++){    
    text = text +`[${x}] `+playable[i]
    x++
}
console.log(text)
choose = Number(input.question('Escolha qual o modo de jogo (caso seja restrito)\nR:'))
NewGame.playableModes = playable[choose - 1]
if(Games[NewGame.shorcut] !== undefined){
    return console.log(`Jogo com a shortcut ${NewGame.shorcut} ja existe`)
}
Games[`${NewGame.shorcut}`] = NewGame
///

fs.writeFileSync('../../dataBase/games/GamesDone.json', JSON.stringify(Games, null, 2));