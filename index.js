const fs = require('fs')
const Discord = require("discord.js");
require('dotenv').config()
	const { Client, IntentsBitField } = require("discord.js");

	const myIntents = new IntentsBitField();
	myIntents.add(IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.GuildMessageReactions, IntentsBitField.Flags.MessageContent)
	const client = new Client({ intents: myIntents });

	console.table(myIntents.toArray())

client.prefix = 'g!'
client.commands = new Discord.Collection();
client.login(process.env.BOT_KEY);

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}
