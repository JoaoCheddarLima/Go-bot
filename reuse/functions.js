const fs = require('fs')
const input = require('readline-sync')
const { personagem } = require('./classes.js')
const { didLevelUp } = require('./levelChecker.js')
let playerdata = JSON.parse(fs.readFileSync('./database/players.json'))

this.checks = async (id) => {
    let playerdata = JSON.parse(fs.readFileSync('./database/players.json'))
    let checks = {
        'exist':true,
        'message':''
    }
    try{
    if(playerdata[id]['nome'] === undefined){
        checks['exist'] = false
        checks['message'] = 'Jogador não registrado.'
        return checks
    }
    }catch(err){
        checks['exist'] = false
        checks['message'] = 'Jogador não registrado. !tutorial para iniciar'
        return checks
    }
    return checks
}

this.insight = (name) => {
    let insights = JSON.parse(fs.readFileSync('./database/insights.json'))
    let actual = insights[name]
    if(actual === undefined){
        insights[name] = 1
        fs.writeFileSync('./database/insights.json', JSON.stringify(insights, null, 2))
    }else{
        insights[name] = insights[name] + 1
        fs.writeFileSync('./database/insights.json', JSON.stringify(insights, null, 2)) 
    }
}
this.novojogador = (id, nome) => {
    try{
        let test = playerdata[`${id}`]['nome']
        return
    }catch(err){
        const newplayer = new personagem(id, nome).criar()
        playerdata[`${id}`]= newplayer
        fs.writeFileSync('./database/players.json', JSON.stringify(playerdata, null, 2))

        let Rplayerdata = JSON.parse(fs.readFileSync('./database/players.json'))
        return(Rplayerdata[`${id}`])
    }    
}

this.finder = (a, b) => {
    for(let i = 0; i < b.length; i++){
        if(b[i] === a[0]){
            let newindex = i
            for(let x = 0; a.length; x++){
                if(a[x] === b[newindex]){
                    newindex++
                    if(x === a.length - 1){
                        return true
                    }
                    continue
                }
                return false
            }
        }
        continue
    }
}
