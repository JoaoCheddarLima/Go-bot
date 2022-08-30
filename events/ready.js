const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: 'ready',
	once: true,
	execute(client){
		let servers = (client.guilds.cache.map(g => g.name).length)
		const channel = client.channels.cache.get("1013889372426350713");
		let embed = new EmbedBuilder()
		.setColor('#00FF00')
		.setFooter({text: `✔️ Go! está online agora em ${servers} servidor`})
		.setTimestamp()
		channel.send({embeds:[embed]})
	}
}
