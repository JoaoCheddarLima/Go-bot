const {EmbedBuilder} = require('discord.js')
const fs  = require('fs')

this.overView = async (id, client) => {
    const users = JSON.parse(fs.readFileSync('./src/dataBase/userData/users.json'))
    const games = JSON.parse(fs.readFileSync('./src/dataBase/games/GamesDone.json'))
    const user = users[id]

    let dados = {
        gamesPlayed:[],
        moedas:user['Banco']['bal']
    }

    for(key in user['Games']){
        dados['gamesPlayed'].push(games[key]['nome'])
    }

    let formatter = (arr) => {
        let text = ''
        for(key of arr){
            text+=`🔸 - ${key}\n`
        }
        return text
    }
    const embed = new EmbedBuilder()
    .setColor("#000000")
    .setThumbnail(await client.users.cache.get(id).displayAvatarURL())
    .setTitle(`⭐ ${await client.users.cache.get(id).username} ⭐`)
    for(Item in user){
        if(Item === 'Games'){
            embed.addFields({
                name:'🎈 JOGOS DESCOBERTOS 🎈',
                value:`${dados['gamesPlayed'].length === 0? "🚧 N/A 🚧":formatter(dados['gamesPlayed'])}`,
                inline:true
            })  
        }
        if(Item === 'Banco'){
            embed.addFields({
                name:'💎 BANCO 💎',
                value:`💸 ${dados['moedas']}$`,
                inline:true
            })
        }         
    }
    return embed
}

this.overGames = async (id, client) => {
    const users = JSON.parse(fs.readFileSync('./src/dataBase/userData/users.json'))
    const games = JSON.parse(fs.readFileSync('./src/dataBase/games/GamesDone.json'))

    let names = []
    let acess = []
    let desc = {}
    const dados = users[id]['Games']

    for(key in dados){
        names.push(games[key]['nome'])
        acess.push(key)
        for(info in dados[key]){
            desc[key] === undefined ? desc[key] = [`🔸 ${info}: ${dados[key][info]}`] : desc[key].push(`🔸 ${info}: ${dados[key][info]}`)
        }
    }

    let formatter = (arr, v) => {
        let text = ''
        for(key of arr[v]){
            text+=key+'\n'
        }
        return text
    }

    const embed = new EmbedBuilder()
    .setColor('#7600bc')
    .setTitle(`🎈 Informações de: ${client.users.cache.get(id).username}`)
    for(key of names){
        embed.addFields({
            name:'🎯 '+key,
            value:await formatter(desc, acess[names.indexOf(key)]),
            inline:true
        })
    }
    return embed
}