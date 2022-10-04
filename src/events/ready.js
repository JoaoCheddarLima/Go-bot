const { EmbedBuilder } = require("discord.js");
const fs = require('fs')
module.exports = {
	name: 'ready',
	once: true,
	execute(client){
		let servers = (client.guilds.cache.map(g => g.name).length)
		const channel = client.channels.cache.get("1013889372426350713");
		x = 'servidor'
		if(servers > 1){
			x = 'servidores'
		}
		let embed = new EmbedBuilder()
		.setColor('#00FF00')
		.setFooter({text: `✔️ Go! está online agora em ${servers} ${x}`})
		.setTimestamp()
		channel.send({embeds:[embed]})
	}
}
