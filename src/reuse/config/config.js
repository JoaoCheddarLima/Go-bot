const fs = require('fs')
let path = './src/reuse/config/userOptions.json'
let pathServers = './src/reuse/config/serverConfigs.json'

this.checkServerConfigs = (message) => {
    const saved = JSON.parse(fs.readFileSync(pathServers))
    let serverId = message.guild.id
    let channelId = message.channel.id
    if(saved[`${serverId}`]?.channels[`${channelId}`] === undefined){
        return false
    }
    return true
}

this.registerUses = (message) => {
    const saved = JSON.parse(fs.readFileSync(pathServers))
    saved[message.guild.id].channels[message.channelId].uses += 1
    fs.writeFileSync(pathServers, JSON.stringify(saved, null, 2));
}

this.registerChannel = (message) => {
    const saved = JSON.parse(fs.readFileSync(pathServers))
    let serverId = message.guild.id
    let channelId = message.channel.id
    if(saved[`${serverId}`] === undefined){
        saved[`${serverId}`] = {
            name:message.guild.name,
            channels:{
                [`${channelId}`]:{
                        allowed:true,
                        uses:0
                }
            }
        }
        fs.writeFileSync(pathServers, JSON.stringify(saved, null, 2));
        return true
    }
    if(saved[`${serverId}`].channels[`${channelId}`] === undefined){
        saved[`${serverId}`].channels[`${channelId}`] = {
            allowed:true,
            uses:0
        } 
        fs.writeFileSync(pathServers, JSON.stringify(saved, null, 2));
        return true
    }
    return false
}

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

this.getInfo = (game, infos) => {

}