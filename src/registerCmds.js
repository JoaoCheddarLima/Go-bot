const fs = require('fs')
const input = require('readline-sync')

let path = fs.readdirSync('./commands')
let data = JSON.parse(fs.readFileSync('./cmds.json'))
for(key in path){
   let name = path[key].split('').splice(0,path[key].length-3).reduce((x,y) => x+=y, '')
   if(data[name] === undefined){
    data[name] = [name]
    fs.writeFileSync('./cmds.json',JSON.stringify(data,null,2))
   }
}

let addAlt = () => {
    data = JSON.parse(fs.readFileSync('./cmds.json'))
    let text = ''
    let i = 1
    let options = []
    for(key in data){
        options.push(key)
    }
    for(key of options){
        text+=`[${i}] - `+key+'\n'
        i++
    }
    let res = Number(input.question(text+'Gostaria de adicionar alts a qual comando?\nR:'))-1
    while(true){
        text = ''
        text+='\nAlts atuais: -> ['+data[options[res]]+']\n'
        let selector = input.question(text+'\nGostaria de adicionar mais alts?\n\n("n" Para cancelar)\nR:').toLowerCase()
        if(selector === 'n'){
            break
        }
        data[options[res]].push(selector)
    }
    fs.writeFileSync('./cmds.json',JSON.stringify(data,null,2))
}
addAlt()