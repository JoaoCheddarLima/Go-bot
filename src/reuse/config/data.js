const fs = require('fs')
let path = './src/dataBase/userData/users.json'
let pathGames = './src/dataBase/games/GamesDone.json'
class user {
    constructor(id) {
        this.id = id
    }
    criar(){
        let data = {
            [`${this.id}`]:{
                "gamedata":{

                }
            }
        }
        return data
    }
}

this.checkUser = (userid) => {
    let data = JSON.parse(fs.readFileSync(path))
    if(data[userid] === undefined){
        data = new user(userid).criar()
        return fs.writeFileSync(path, JSON.stringify(data, null, 2));
    }
}
this.addGamePoints =  (userid, game, infos) => {
    this.checkUser(userid)
    let data = JSON.parse(fs.readFileSync(path))
    let infosNeed = JSON.parse(fs.readFileSync(pathGames))
    if(data[userid]["gamedata"][game] === undefined){
        data[userid]["gamedata"][game] = {}
    }
    let infoArray = infosNeed[game].infos
    for(key of infoArray){
        data[userid]["gamedata"][game][key] === undefined ? data[userid]["gamedata"][game][key] = infos[key] : data[userid]["gamedata"][game][key] += infos[key]
    }
    return fs.writeFileSync(path, JSON.stringify(data, null, 2));
}