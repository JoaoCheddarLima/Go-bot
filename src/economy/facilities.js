const fs = require('fs')

this.random = (a,b) => {Math.floor(Math.random() * (b - a + 1)+a)}

this.dateDif = (date) => {
    let text
    let newa = new Date()
    let h = date.getHours()
    let mins = date.getMinutes()
    let secs = date.getSeconds()
    let finalh = 24 - h
    let finalm = 60 - mins
    let finalsec = 60 - secs
    if(mins > 0){
        finalh -= 1
    }
    if(finalsec > 0){
        finalsec-= 1
    }
    text = `${finalh}h ${finalm}m e ${finalsec}seg`
    return text
}

this.checkupdate = (user) => {
    const dailyData = JSON.parse(fs.readFileSync('./src/dataBase/userData/daily.json'))
    const users = JSON.parse(fs.readFileSync('./src/dataBase/userData/users.json'))
    let date = new Date()
    let ano = date.getFullYear()
    let mes = date.getMonth()
    let dia = date.getDate()
    if(dailyData[ano] === undefined){
        dailyData[ano] = {}
    }
    if(dailyData[ano][mes] === undefined){
        dailyData[ano][mes] = {}
    }
    if(dailyData[ano][mes][dia] === undefined){
        dailyData[ano][mes][dia] = []
    }
    console.log(dailyData)
    console.log(dailyData[ano][mes][dia].includes('banana'))
    if(dailyData[ano][mes][dia].includes(user) === false){
        dailyData[ano][mes][dia].push(user)
        users[user].bal += 15
        fs.writeFileSync('./src/dataBase/userData/users.json', JSON.stringify(users, null, 2))
        fs.writeFileSync('./src/dataBase/userData/daily.json', JSON.stringify(dailyData, null, 2))
        return true
    }
    return false
}