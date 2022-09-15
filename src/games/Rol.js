const { turn, removePlayer, shuffling, luckyNot, russaEnd, shoot } = require('../reuse/games/russaConfigs')
module.exports = async (players,GAME_INFO,client,message) => {
    let tambor = [null,null,null,null,null,true]
    let slot = 0
    let action 
    let prize = 0
    let originalmsg 
    let atual = 0
    let collected
    let reactions = ['🔫','🔀']
    let atirar = (playerid, tambor, players) => {
        let islast = () => {
            if(slot === tambor.length -1){
                slot = 0
            }else{
                slot++
            }
        }
        if(tambor[slot] === true){
            players = removePlayer(playerid, players)
            atual -= 1
            islast()
            return true
        }else{
            islast()
            return false
        }
    }
    let shuffle = (tambor) =>{
        tambor[tambor.indexOf(true)] = null
        tambor[Math.floor(Math.random() * tambor.length)] = true
        slot = Math.floor(Math.random() * tambor.length)
    }
    let new_game = async () => {
        let players = [...GAME_INFO.players]
        atual = 0
        shuffle(tambor)
        let new_round = async () => {
            if(players.length === 1){
                originalmsg.delete().catch(err => {})
                return await message.channel.send({embeds:[russaEnd(client.users.cache.get(players[0]).username, prize)]})
            }
            if(atual > players.length){
                atual = 0
            }
            originalmsg = await message.channel.send({embeds:[turn(client.users.cache.get(players[atual]).username)]})
            for(key of reactions){
                await originalmsg.react(key)
            }
            const filter = (reaction, user) => {
                if(reactions.indexOf(reaction.emoji.name) !== -1 && user.id === players[atual]){
                    collected = reaction.emoji.name
                    return true
                }
                return false
            };
            const collector = originalmsg.createReactionCollector({ filter, time: 30000, max:1 });
            collector.on('collect', async (reaction, user) => {
                if(action !== undefined){
                    await action.delete().catch(err => {})
                }
                if(collected === '🔀'){
                    shuffle(tambor)
                    await originalmsg.reactions.removeAll()
                    await originalmsg.edit({embeds:[shuffling()]})
                    //action
                    let resultEmbed = luckyNot(atirar(players[atual], tambor, players))
                    setTimeout(async () => {await originalmsg.delete().catch(err => {});action = await message.channel.send({embeds:[resultEmbed]})}, 5000)
                    setTimeout(() => {new_round()}, 10000)

                }else{
                    await originalmsg.reactions.removeAll()
                    await originalmsg.edit({embeds:[shoot(client.users.cache.get(players[atual]).username)]})
                    //action
                    let resultEmbed = luckyNot(atirar(players[atual], tambor, players))
                    setTimeout(async () => {await originalmsg.delete().catch(err => {});action = await message.channel.send({embeds:[resultEmbed]})}, 5000)
                    setTimeout(() => {new_round()}, 10000)
                }
            })
            collector.on('end', async a => {
            });
        }
        new_round()
    }
    new_game()
}