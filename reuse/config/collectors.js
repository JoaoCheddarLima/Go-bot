this.chat_collector_simples = (message, players, filtro) => {
    console.log(players)
    found = false
    let data
    const filter = m => {
        for(let i = 0; i < players.length; i++){
            console.log(players.length)
            if(m.author.id === players[i])
            found = true
        }
        data = m.content
        if(found === true && m.content === filtro) return true
        return false
    };
    message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] })
    .then(collected => {
        return data
    }).catch(collected => {
        message.channel.send('Acabou o tempo')
    });
}