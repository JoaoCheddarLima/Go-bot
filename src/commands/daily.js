const { checkupdate, dateDif} = require('../economy/facilities');
const { checkUser } = require('../reuse/config/data');
const { insight, delete_msg } = require('../reuse/functions');
const { button, idBuilder } = require('../reuse/config/buttons.js');
const { justAText } = require('../reuse/games/global');

module.exports = {
    name:'daily',
    async execute(message,args, client, input1, input2, userId){
        //
        checkUser(message.author.id)
        insight('Daily')
        //
        let config = {
            id:[idBuilder(3)],
            text:['Receber pagamento']
        }
		await message.channel.send({
             components: [
                button(config)
            ] 
            });
        await delete_msg(message)
        const filter = i => i.customId === config.id && i.user.id === message.author.id;
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
    }
}
