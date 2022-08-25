module.exports = {
	name: 'ready',
	once: true,
	execute(client){
		const channel = client.channels.cache.get("971153175316922431")
		channel.send('Go está online chefinho!')
	}
}
