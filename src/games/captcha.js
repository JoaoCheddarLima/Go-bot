const { idBuilder, buttons } = require("../reuse/config/buttons")
const { createGameInstance, updateMove, gameDisplay } = require("../reuse/games/captcha-cfgs/captcha")
const { checkupdate, dateDif} = require('../economy/facilities');
const { delete_msg } = require('../reuse/functions');
const { justAText } = require('../reuse/games/global');

module.exports = async (message,client,execute, res) => {
    let choose
    let map = await createGameInstance(res.x, res.y)
    let configs = {
        id:[idBuilder(2),idBuilder(3),idBuilder(4),idBuilder(5)],
        text:['⬅','⬆','⬇','➡']
    }
    let originalmsg = await message.channel.send({
        content:await gameDisplay(map), 
        embeds:[justAText('🎈 Se mova até o alvo 🎯, para receber seu daily')],
        components:[buttons(configs, configs.id.length)]
    })
    let game = () => {
        const filter = async i => {
            if(configs.id.indexOf(i.customId) !== -1 && i.user.id === message.author.id){
                choose = i.customId
                moveinfo = await updateMove(configs.id.indexOf(choose), map)
                if(moveinfo === false){
                    i.reply({content:'Não é possível se mover nesta direção!', ephemeral:true})
                }else{
                    return true
                }
            }
            return false
        }
    
        const collector = originalmsg.createMessageComponentCollector({ filter, time: 60000, max:1 });
    
        collector.on('collect', async i => {
            if(moveinfo === true){
                await originalmsg.delete().catch(err => {})
                let config = {
                    id:[idBuilder(3)],
                    text:['Receber pagamento 💸']
                }
                await message.channel.send({
                     components: [
                        buttons(config)
                    ] 
                });
                await delete_msg(message)
                const filter = i => i.customId === config.id[0] && i.user.id === message.author.id;
                const collector = message.channel.createMessageComponentCollector({ filter, time: 15000, max:1 });
                
                collector.on('collect', async i => {
                    let paid = '✅ Pagamento recebido +15💰'
                    let text = checkupdate(message.author.id) === true? paid : `❌ Disponível novamente em ${dateDif(new Date())}`
                    await i.update({
                        components:[], 
                        embeds:[
                            justAText(text === paid? text + `, 🔔 Proximo em: ${dateDif(new Date())}`:text, text === paid ? '#00FF00': "#FF0000")
                        ]});
                });
                collector.on('end', collected => console.log(`Collected ${collected.size} items`));
            
            }else{
                await i.update({content:await gameDisplay(moveinfo), components:[await buttons(configs,configs.id.length)]})
                game()
            }
        })
    }
    game()
}
