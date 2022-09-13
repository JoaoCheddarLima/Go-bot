module.exports = {
	name: 'messageCreate',
	execute(message, client){
		if (message.author.bot) return;
		if (message.channel.type == 'dm') return;
		if (!message.content.startsWith(client.prefix));

	const args = message.content.slice(client.prefix.length).trim().split(/ +/)

	const input1 = args[1]
	const input2 = args[2]
	const userId = message.author.id
	let type = 'message'
	const commandName = args.shift().toLowerCase();

	if(!client.commands.has(commandName)) return;

	const command = client.commands.get(commandName);
		try {
			command.execute(message,args, client, input1, input2, userId)

		} catch(err){console.log(err)}
	},
}