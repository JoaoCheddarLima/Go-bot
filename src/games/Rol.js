const { AttachmentBuilder } = require('discord.js')
const { subMoney, addMoney } = require('../economy/utils/ecoManager')
const { insight } = require('../reuse/functions')
const { turn, removePlayer, shuffling, luckyNot, russaEnd, shoot } = require('../reuse/games/russaConfigs')
module.exports = async (x,GAME_INFO,client,message) => {
    insight('RoletaRussa', true, 'games')
    let tambor = [null,null,null,null,null,true]
    let slot = 0
    let action 
    let players
    let prize = 0
    let originalmsg 
    let atual = 0
    let collected
    let reactions = ['🔫','🔀']
    let atirar = (playerid, tambor) => {
        atual++
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
        players = [...GAME_INFO.players]
        atual = 0
        shuffle(tambor)
        let new_round = async () => {
            if(players.length === 1){
                for(key of GAME_INFO.players){
                    message.channel.send({embeds:[await subMoney(key,15,client.users.cache.get(key).username)]})
                    prize+=15
                }
                return await message.channel.send({embeds:[russaEnd(client.users.cache.get(players[0]).username, prize)]})
            }
            if(atual > players.length - 1){
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
                    await originalmsg.edit({embeds:[shuffling().setImage(`https://c.tenor.com/uz1xKkW94s4AAAAC/gun-reload.gif`)]})
                    //action
                    let result = atirar(players[atual], tambor, players)
                    let resultEmbed = await luckyNot(result).setImage(result === true? 'https://i.gifer.com/NNCv.gif' : 'https://tabulaquadrada.com.br/wp-content/uploads/tumblr_nvfbmbS3341qdvzvno2_250.gif')
                    setTimeout(async () => {
                        await originalmsg.delete().catch(err => {});
                        action = await message.channel.send({embeds:[resultEmbed]})}, 5000)
                    setTimeout(() => {new_round()}, 10000)

                }else{
                    await originalmsg.reactions.removeAll()
                    await originalmsg.edit({embeds:[await shoot(client.users.cache.get(players[atual]).username).setImage('https://64.media.tumblr.com/ffeb8ab6ff50ac5f6c0670b77bd9540f/96b9c36b2504d5cd-92/s540x810/41ae461d0759adeb1e9da16b3e78ea9ffd5c40e9.gif')]})
                    //action
                    let result = atirar(players[atual], tambor, players)
                    let resultEmbed = await luckyNot(result).setImage(result === true? 'https://i.gifer.com/NNCv.gif' : 'https://tabulaquadrada.com.br/wp-content/uploads/tumblr_nvfbmbS3341qdvzvno2_250.gif')
                    setTimeout(async () => {
                        await originalmsg.delete().catch(err => {});
                        action = await message.channel.send({embeds:[resultEmbed]})
                    }, 5000)
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