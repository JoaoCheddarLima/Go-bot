const fs = require('fs')

module.exports = {
	name: 'messageCreate',
	async execute(message, client){
		if (message.author.bot) return;
		if (message.channel.type == 'dm') return;
		if(message.content === '<@963119439832834088>'){
			const command = client.commands.get('ajuda');
			try {
				command.execute(message,'x',client)
			} catch(err){console.log(err)}
		}
		if(!message.content.toLowerCase().startsWith(client.prefix)) return;

	const args = message.content.slice(client.prefix.length).trim().split(/ +/)
	const checkCommandAlts = (info) => {
		let alts = JSON.parse(fs.readFileSync("./src/cmds.json"))
		for(key in alts){
			if(alts[key].indexOf(info) !== -1){
				return key
			}
		}
		return false
	}
	const input1 = args[1]
	const input2 = args[2]
	const userId = message.author.id
	const commandName = await checkCommandAlts(args.shift().toLowerCase())
	if(!client.commands.has(commandName)) return;

	const command = client.commands.get(commandName);
		try {
			command.execute(message,args, client, input1, input2, userId)

		} catch(err){console.log(err)}
	},
}