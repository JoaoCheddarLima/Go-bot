const { registerChannel } = require("../reuse/config/config")
const { insight } = require("../reuse/functions")
const { registerPrompt, notPermissions } = require("../reuse/games/global")

module.exports = {
    name:'reg',
    async execute(message,args, client, input1, input2, userId){
        let allowed = message.member.permissions.has('ADMINISTRATOR') ? true : false
        if(allowed === true){
            let info = registerChannel(message)
            info === true? insight('CanalRegistrado') : insight('CanalRegistradoAlready')
            return message.channel.send({embeds:[registerPrompt(info)]}).catch(err => {})
        }
        insight('CanalRegistradoFail')
        return message.reply({embeds:[notPermissions()]}).catch(err => {})
    }
}