//terminal file
const fs = require('fs')
const rules = JSON.parse(fs.readFileSync('./rules.json'))
const input = require('readline-sync')
const walls = '\n<-> || <--> || <->\n'
let text 
let res
let question = (q, t) => {
    if(t == 'num'){
        res = Number(input.question(q+'\nR:'))
        clear()
        return res
    }
    res = input.question(q)
    clear()
    return res
}
let clear = () => {
    console.clear()
}

if(Object.keys(rules).length === 0){
    text = walls+'Nada encontrado, iniciando protocolo 000.'+walls
    console.log(text)
    let v1 = question('Insira o valor minimo do padrao de ganhos', 'num')
    let v2 = question('Insira o valor maximo do padrao de ganhos', 'num')
    while(v2 < v1){
        v2 = question(`Ops, valor inserido aqui deve ser maior que o inicial -> ${v1}\nInsira o valor maximo do padrao de ganhos`, 'num')
    }
    rules['default'] = {v1:v1, v2:v2}

    fs.writeFileSync('./rules.json',JSON.stringify(rules,null,2))
    clear()
    console.log('Regras definidas')
    console.log(rules)
}
//adicionar o overwrite dos dados depois