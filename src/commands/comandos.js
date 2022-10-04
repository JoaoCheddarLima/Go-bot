const fs = require('fs')
const { insight } = require('../reuse/functions')
const { justAText } = require('../reuse/games/global')
module.exports = {
    name:'comandos',
    async execute(message,args, client, input1, input2, userId){
        insight('Comandos')
        let commands = []
        let dirrFiles = fs.readdirSync('./src/commands')
        let altcmds = JSON.parse(fs.readFileSync('./src/cmds.json'))
        for(key in dirrFiles){
            commands.push(dirrFiles[key].split('').splice(0,dirrFiles[key].length-3).reduce((x,y) => x+=y, ''))
        }
        let text = '🎯 Comandos existentes\n'
        let footer = ''
        for(key of commands){
            footer+= `🔸 ${client.prefix}${key}\n`.toUpperCase()
            footer+= "🚧 "+altcmds[key].reduce((x,y)=>x+='['+y+'] ','').trim()+'\n\n'
        }
        footer+=`🎈 Para mais informações acesse nosso site.`
        message.channel.send({embeds:[justAText(footer,'#FF69B4').setDescription(`[${text}](https://jvrl18.github.io/Go-ws/public/comandos.html)`)]})
    }
}