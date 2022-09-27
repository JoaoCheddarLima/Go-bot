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
		/*
		let date = new Date()
		function repeater(){
			const send = require('../dataGraphs/dataGraphs.js')
			send(client)
			let wait
			let actual = Number(date.getHours())
			if(actual === 12 || actual === 0){
				console.log(`Mensagem automatica definida para daqui: ${43200000/3600000} ${wait === 1? 'Hora': "Horas"}`)
				setTimeout(() => {
					repeater()
				}, 43200000)
			}else{
				if(actual > 12){
					wait = 3*3600000
					console.log(`Mensagem automatica definida para daqui: ${wait/3600000} ${wait === 1? 'Hora': "Horas"}`)
				}else{
					wait = 3*3600000
					console.log(`Mensagem automatica definida para daqui: ${wait/3600000} ${wait === 1? 'Hora': "Horas"}`)
				}
				setTimeout(() => {
					repeater()
				}, wait)
			}
		}
		repeater()*/
		let embed = new EmbedBuilder()
		.setColor('#00FF00')
		.setFooter({text: `✔️ Go! está online agora em ${servers} ${x}`})
		.setTimestamp()
		channel.send({embeds:[embed]})
	}
}
