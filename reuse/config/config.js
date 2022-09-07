const fs = require('fs')
let path = './reuse/config/userOptions.json'

let genConfig = (id) => {
    const usersConfigs = JSON.parse(fs.readFileSync(path))
    usersConfigs[`${id}`] = {}
    fs.writeFileSync(path, JSON.stringify(usersConfigs, null, 2));
}

let checkUser = (id) => {
    const usersConfigs = JSON.parse(fs.readFileSync(path))
    if(usersConfigs[id] === undefined) return false
    return true
}
let checkGame = (id, game) => {
    const usersConfigs = JSON.parse(fs.readFileSync(path))
    if(usersConfigs[`${id}`][`${game}`] === undefined){ 
        usersConfigs[`${id}`][`${game}`] = true
    }
    fs.writeFileSync(path, JSON.stringify(usersConfigs, null, 2));
}
this.checkConfigs = (id, game) => {
    if(checkUser(id) === false){
        genConfig(id)
    }
    checkGame(id, game)
    const usersConfigs = JSON.parse(fs.readFileSync(path))
    if(usersConfigs[`${id}`][`${game}`] === true) return true
    return false
}