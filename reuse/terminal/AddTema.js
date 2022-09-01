const input = require('readline-sync')
const fs = require('fs')

let tema = input.question('Tema?\nR:')

while(true){
    const database = JSON.parse(fs.readFileSync('./questions.json'))
    let palavra = input.question('Palavra?\nR:')


    if(database[tema] === undefined){
        database[`${tema}`] = []
        database[tema].push(palavra)
        console.log(`\n-> Status: Bom\n[nova]Palavra: ${palavra} <-\n[novo]Tema: ${tema} <-\n`)
    }else{
        if(database[tema].indexOf(palavra) === -1){
            console.log(`\n-> Status: Ok\n[nova]Palavra: ${palavra} <-\nTema: ${tema} <-\n`)
            database[tema].push(palavra)
        }else{
        console.log(`\n-> Status: Recusado\n[nova]Palavra: "${palavra}" já existem em -> Tema:${tema}, index:${database[tema].indexOf(palavra)}\n`)
        }
    }
    fs.writeFileSync('./questions.json', JSON.stringify(database, null, 2));
}