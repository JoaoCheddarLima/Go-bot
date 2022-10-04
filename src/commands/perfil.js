const { isValidUser } = require("../reuse/config/config")
const { error_embed } = require("../reuse/error-embed")
const fs = require('fs')
const { idBuilder, buttons, button } = require("../reuse/config/buttons")
const { delete_msg } = require("../reuse/functions")
const { overView,  overGames} = require("../reuse/profile/proembeds")
const { insight } = require("../reuse/functions")
module.exports = {
    name:'perfil',
    async execute(message,args, client, input1, input2, userId){
        insight('Perfil')
        let checkd = input1 === undefined? message.author.id : await isValidUser(input1, client)
        if(checkd === false) return message.channel.send({embeds:[error_embed('Usuário inválido')]})

        let data = JSON.parse(fs.readFileSync('./src/dataBase/userData/users.json'))
        let user = data?.[checkd]
        if(user === undefined){
            return await message.channel.send({embeds:[error_embed('Usuário existente porém, não registrado no go!')]})
        }
        let botmsg
        let openMenu = async (i) => {
            const configs = {
                id:[idBuilder(7)],
                text:['🌟 Jogos'],
                length:1
            }
            // for(key in user){
            //     configs.text.push(key)
            //     configs.id.push(idBuilder(7))
            //     configs['length'] +=1
            // }
            await delete_msg(message)
            const filter = i => {
                if(configs['id'].indexOf(i.customId) !== -1 && i.user.id === message.author.id){
                    choose = i.customId
                    return true
                }
                return false
            }
            if(botmsg !== undefined){
                botmsg = await i.update({embeds:[await overView(checkd,client)],components:[await buttons(configs,configs['length'])]})
            }else{
                botmsg = await message.channel.send({embeds:[await overView(checkd,client)],components:[await buttons(configs,configs['length'])]}) 
            }
            let choose
            const collector = message.channel.createMessageComponentCollector({ filter, time: 30000, max:1 });
            collector.on('collect', async i => {
                const config = {
                    text:'Voltar',
                    id:idBuilder(5)
                }
                botmsg = await i.update({
                    embeds:[await overGames(checkd, client)],
                    components:[button(config)]
                });
                const filter = i => {
                    if(config['id'] === i.customId && i.user.id === message.author.id){
                        choose = i.customId
                        return true
                    }
                    return false
                }

                const collector = message.channel.createMessageComponentCollector({ filter, time: 60000, max:1 });
                collector.on('collect', async i => {
                    openMenu(i)
                    console.log('yo')
                })

            });
            
        }
        openMenu()
    }
}