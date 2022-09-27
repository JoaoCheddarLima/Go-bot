const fs = require('fs')
let path = './src/database/'
const { insight } = require('../reuse/functions')
const { InvitingEmbed, JoinEmbed } = require('../reuse/games/mathquestions.js')
const {EmbedBuilder} = require('discord.js')
const { error_embed } = require('../reuse/error-embed')
const { checkConfigs, checkServerConfigs, registerUses } = require('../reuse/config/config')
const { callAdmin, menu, gameChooseEmbed } = require('../reuse/games/global')
const { idBuilder, buttons, button } = require('../reuse/config/buttons')

module.exports = {
    name:"jogar",
    async execute(message,args, client, input1, input2, userId){
        //data collector
        insight('GameMenu')
        if(checkServerConfigs(message) === false){
            return message.channel.send({embeds:[callAdmin()]})
        }else{ registerUses(message) }
        //variables
        let GAME_INFO = {
            caller:'',
            input1:'',
            type:'',
            players:[],
            end:''
        }
        let reactions = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣']
        let games = JSON.parse(fs.readFileSync(`${path}`+'games/GamesDone.json'))
        let games_message = ''
        let game_choosed
        let values = 1
        let game_options = {}
        let error = false
        let collected
        let blacked = '```'
        let originalmsg
        let embed
        let userA = userId  
        let userB 
        let players = []
        //switches
        try{
            userA_Name = await client.users.cache.get(userA).username
        }catch(err){
            await message.channel.send({embeds:[error_embed('por favor marque um usuário válido')]})
            .then(() => message.delete().catch((err) => {console.error(err)}))
            return
        }
        if(input1){
            try{
                //if(userId === input1.slice(2).slice(0,-1)) return message.channel.send({embeds:[error_embed('ainda não pode jogar sozinho')]}).then(() => message.delete().catch((err) => {console.error(err)}))
                if(error == true) return
                userB = input1.slice(2).slice(0,-1)
                userB_Name = await client.users.cache.get(userB).username
                GAME_INFO.input1 = userB
                players.push(userA, userB)
            }catch(err){
                await message.channel.send({embeds:[error_embed('por favor marque um usuário válido')]})
                .then(() => message.delete().catch((err) => {console.error(err)}))
                return
            }
        }
        //games executor
            let startGame = async () => {
                insight('GamesPlayed')
                await originalmsg.delete().catch(err => {})
                const game = require(`../games/${game_choosed}`)
                game(players,GAME_INFO,client,message)
            }
        //menu selecionar jogos
        let GLOBAL_SELECTOR = async () => {
            let text = `♦ Escolha um modo de jogo ♦`
            const [id1,id2] = [idBuilder(3), idBuilder(3)]

            let config = {
                text:['😎 Sozinho', '🌎 Grupo'],
                id:[id1,id2]
            }

            originalmsg = await message.channel.send({
                components:[buttons(config, 2)],
                content:`||<@${userA}>||`,embeds:[menu(text)]
            })
            const filter = i => {
                collected = i.customId
                return config.id.some((e => e === i.customId)) === true && i.user.id === message.author.id
            }
            const collector = message.channel.createMessageComponentCollector({ filter, time: 15000, max:1 });
    
            collector.on('collect', async i => {
                if(collected === id1){
                    players.push(userId)
                    GAME_INFO.type = 'solo'
                    GAME_INFO.input1 = 'N/A'
                    GAME_INFO.caller = userId
                    GAME_INFO.options = 'N/A'
                    GAME_INFO.players = [`${userId}`]
                    GAME_MENU(i)
                }
                if(collected === id2){
                    players.push(userId)
                    GAME_INFO.type = 'grupo'
                    GAME_INFO.input1 = 'N/A'
                    GAME_INFO.caller = userId
                    GAME_INFO.options = 'N/A'
                    GAME_INFO.players.push(userId)
                    
                    config = {
                        text:'Entrar no grupo',
                        id:idBuilder(6)
                    }

                    await i.update({components:[button(config)],embeds:[InvitingEmbed(GAME_INFO.caller)]})
                    const filter = async i => {
                        let gather = async (i) => {
                            console.log(i.user.bot)
                            if(i.user.bot || players.indexOf(i.user.id) !== -1) return false
                            players.push(i.user.id)
                            GAME_INFO.players.push(i.user.id)
                            i.update({components:[button(config)],embeds:[InvitingEmbed(GAME_INFO.caller)]})
                            return true
                        }
                        res = await gather(i)
                        return res
                    };

                const collector = message.channel.createMessageComponentCollector({ filter, time: 15000, max:10 });

                collector.on('collect', async i => {
                    await originalmsg.channel.send({embeds:[JoinEmbed(client.users.cache.get(i.user.id).username)]})
                })
                collector.on('end', collected => GAME_MENU(i));
                }
            });
            collector.on('end', collected => {});
        }
        let GAME_MENU = async (i) => {
            insight(GAME_INFO.type, true, 'mostPlayed')
            collected = ''

            let configs = {
                id:[],
                text:[]
            }

            for(key in games){
                games_message = games_message + `${blacked}${reactions[values-1]} - ${games[key].nome}${blacked}\n`
                game_options[`${values}`] = games[key].shortcut
                configs.id.push(games[key].shortcut)
                configs.text.push(String(values))
                values++
            }
            await originalmsg.edit({components:[buttons(configs, values-1)],embeds: [gameChooseEmbed(GAME_INFO.caller,games_message )]})
            
            const filter = async i => {
                if(configs.id.indexOf(i.customId) !== -1 && i.user.id === (GAME_INFO.caller)){
                    if(game_options[configs.id.indexOf(i.customId)+1] === 'Vel' && GAME_INFO.type !== 'duo'){
                        await i.reply({embeds:[error_embed('este jogo é apenas para dois jogadores')], ephemeral:true})
                        return false
                    }
                    if(game_options[configs.id.indexOf(i.customId)+1] === 'Rol' && GAME_INFO.type == 'solo'){
                        await i.reply({embeds:[error_embed('este jogo não pode ser jogado sozinho')], ephemeral:true})
                        return false
                    }
                    collected = i.customId
                    return true
                }
                return false
            };

            const collector = message.channel.createMessageComponentCollector({ filter, time: 30000, max:1 });

            collector.on('collect', async i => {
                    let getnum = configs.id.indexOf(collected)+1
                    game_choosed = game_options[getnum]
                    const userOptions = JSON.parse(fs.readFileSync('./src/reuse/config/userOptions.json'))
                    checkConfigs(GAME_INFO.caller, game_choosed)
                    if(userOptions[GAME_INFO.caller][game_choosed] === true){
                    let segundos = 15
                    embed = new EmbedBuilder()
                    .setDescription(`${games[game_choosed].guideText}`)
                    .setColor(`${games[game_choosed].cor}`)
                    .setFooter({text:`⭐ Dica: você pode desativar este guia rápido digitando g!guia ${game_options[getnum]} e ativar novamente utilizando g!guia ${game_options[getnum]} ⭐`})
                    originalmsg.edit({components:[],embeds: [embed]})
                    setTimeout(() => {
                        startGame()
                    }, segundos * 1000)
                    }else{
                        startGame()
                    }
            })
            collector.on('end', collected => {
            });
        }
        //menu DUO COM FOTO
        if(input1 !== undefined){
            GAME_INFO.type = 'duo'
            GAME_INFO.input1 = 'N/A'
            GAME_INFO.caller = userId
            GAME_INFO.options = 'N/A'
            GAME_INFO.players = players
            const configs = {
                id:idBuilder(3),
                text:'✅ Aceitar'
            }
            const filter = i => {
                return i.customId === configs.id && i.user.id === (userB);
            };
                embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setFooter({text:`🔸 Oi, ${client.users.cache.get(userB).username}, Você está sendo convidado para jogar em dupla 😳`})
                const collector = message.channel.createMessageComponentCollector({ filter, time: 15000, max:1 });
                originalmsg = await message.channel.send({content:`||<@${userB}>,<@${userA}>||`,embeds: [embed], components:[button(configs)] })
    
                collector.on('collect', async i => {
                    GAME_MENU(i)
                });
                collector.on('end', collected => {
                });
        }else{
            GLOBAL_SELECTOR()
        }
    }
}