const fs = require('fs')
const { checkUser } = require('../../reuse/config/data')
const { justAText } = require('../../reuse/games/global')
let infopath = './src/dataBase/userData/users.json'

this.addGroupMoney = async (obj,x) => {
    let text = ''
    let i = 0
    for(key in obj){
        i++
        await checkUser(key)
    }
    for(key in obj){
        text += `🔸 ${obj[key].username} Recebeu: +${Math.floor(((obj[key].points/1000) + x) * i)}💸\n`
        const data = JSON.parse(fs.readFileSync(infopath))
        data[key]['Banco']['bal'] += Math.floor(((obj[key].points/1000) + x) * i)
        data[key]['Banco']['total'] += Math.floor(((obj[key].points/1000) + x) * i)
        fs.writeFileSync(infopath, JSON.stringify(data, null, 2))
    }
    return await justAText(`📌 Ganhos totais:\n${text}`, '#00FF00')
}

this.addMoney = async (userid, x, username) => {
    await checkUser(userid)
    const data = JSON.parse(fs.readFileSync(infopath))
    data[userid]['Banco']['bal'] += Number(x)
    data[userid]['Banco']['total'] += Number(x)
    fs.writeFileSync(infopath, JSON.stringify(data, null, 2))
    return await justAText(`📌 + ${x}💸 Adicionado a sua conta ${username}`, '#00FF00')
}

this.subMoney = async (userid, x, username) => {
    await checkUser(userid)
    const data = JSON.parse(fs.readFileSync(infopath))
    data[userid]['Banco']['bal'] -= Number(x)
    fs.writeFileSync(infopath, JSON.stringify(data, null, 2))
    return await justAText(`📌 ${x}💸 Removidos de sua conta ${username}`, '#FF0000')
}

this.checkBalance = async (userid) => {
    const data = JSON.parse(fs.readFileSync(infopath))
    return data[userid]['Banco']['bal']
}