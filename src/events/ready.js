const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: 'ready',
	once: true,
	execute(client){
		let servers = (client.guilds.cache.map(g => g.name).length)
		x = 'servidor'
		const channel = client.channels.cache.get("1013576342723366982");
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
