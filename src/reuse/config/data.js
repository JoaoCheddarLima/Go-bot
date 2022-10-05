const fs = require('fs')
let path = './src/dataBase/userData/users.json'
let pathGames = './src/dataBase/games/GamesDone.json'

this.checkUser = (userid) => {
    let data = JSON.parse(fs.readFileSync(path))

    if(data[userid] === undefined){
        data[userid] = {
            "Games":{},
            "Banco":{
                bal:0,
                total:0
            }
        }
        return fs.writeFileSync(path, JSON.stringify(data, null, 2));
    }
}

this.addGamePoints = async (userid, game, infos) => {
    await this.checkUser(userid)
    let data = JSON.parse(fs.readFileSync(path))

    if(data[userid]["Games"][game] === undefined){
        data[userid]["Games"][game] = {}
    }
    for(key in infos){
        data[userid]["Games"][game][key] === undefined ? data[userid]["Games"][game][key] = infos[key] : data[userid]["Games"][game][key] += infos[key]
    }

    return fs.writeFileSync(path, JSON.stringify(data, null, 2));   
}