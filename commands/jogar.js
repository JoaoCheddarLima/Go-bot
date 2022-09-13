const fs = require('fs')
const Canvas = require('@napi-rs/canvas')
const { insight } = require('../reuse/functions')
const { InvitingEmbed, JoinEmbed } = require('../reuse/games/mathquestions.js')
const {EmbedBuilder, AttachmentBuilder} = require('discord.js')
const { error_embed } = require('../reuse/error-embed')
const { checkConfigs } = require('../reuse/config/config')

module.exports = {
    name:"jogar",
    async execute(message,args, client, input1, input2, userId){
        //data collector
        insight('jogar')
        //variables
        let GAME_INFO = {
            caller:'',
            input1:'',
            type:'',
            players:[],
            end:''
        }
        let reactions = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣']
        let games = JSON.parse(fs.readFileSync('./dataBase/games/GamesDone.json'))
        let games_message = ''
        let game_choosed
        let values = 1
        let game_options = {}
        let error = false
        let collected
        let blacked = '```'
        let correct 
        let originalmsg
        let attachment
        let embed
        let userA = userId  
        let userB 
        let userA_Name
        let userB_Name
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
                await originalmsg.delete().catch(err => {})
                const game = require(`../games/${game_choosed}`)
                game(players,GAME_INFO,client,message)
            }
        //menu selecionar jogos
        let GAME_MENU = async () => {
            collected = ''
            for(key in games){
                games_message = games_message + `${blacked}${reactions[values-1]} - ${games[key].nome}${blacked}\n`
                game_options[`${values}`] = games[key].shortcut
                values++
            }

            embed = new EmbedBuilder()
            .setDescription(`🎈 <@${GAME_INFO.caller}> escolha um jogo!! 🎈\n\n${games_message}`)
            .setColor('#adff2f')
            .setFooter({text:`📌 Reaja aqui em baixo ⬇⬇`})
            originalmsg.edit({embeds: [embed]}).then(async original => {
                for(let i = 2; i < reactions.length; i++){
                    await original.react(reactions[i])
                }
            })
            const filter = async (reaction, user) => {
                if(reactions.indexOf(reaction.emoji.name) !== -1 && user.id === (GAME_INFO.caller)){
                    if(game_options[reactions.indexOf(reaction.emoji.name)+1] === 'Vel' && GAME_INFO.type !== 'duo'){
                        await message.channel.send('Este jogo é apenas para dois jogadores')
                        return
                    }
                    collected = reaction.emoji.name
                    return true
                }
                return false
            };
            const collector = originalmsg.createReactionCollector({ filter, time: 30000, max:1 });
            collector.on('collect', async (reaction, user) => {
                    let getnum = reactions.indexOf(collected)+1
                    game_choosed = game_options[getnum]
                    const userOptions = JSON.parse(fs.readFileSync('./reuse/config/userOptions.json'))
                    checkConfigs(GAME_INFO.caller, game_choosed)
                    if(userOptions[GAME_INFO.caller][game_choosed] === true){
                    originalmsg.reactions.removeAll().catch(err => {})
                    let segundos = 15
                    embed = new EmbedBuilder()
                    .setDescription(`${games[game_choosed].guideText}`)
                    .setColor(`${games[game_choosed].cor}`)
                    .setFooter({text:`⭐ Dica: você pode desativar este guia rápido digitando g!guia ${game_options[getnum]} e ativar novamente utilizando g!guia ${game_options[getnum]} ⭐`})
                    originalmsg.edit({embeds: [embed]})
                    setTimeout(() => {
                        startGame();
                        originalmsg.delete()
                        .catch((err)=>{})}, segundos * 1000)
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
            const filter = (reaction, user) => {
                return reaction.emoji.name === '👍' && '✔️' && user.id === (userB);
            };
            const canvas = Canvas.createCanvas(266, 128)
            const ctx = canvas.getContext('2d')
            async function firstbabe(){
                try {
                    //checks
                    await client.users.fetch(userId).catch((err) => {return message.channel.send({embeds:[error_embed('por favor marque um usuário válido')]}).then(() => message.delete().catch((err) => {console.error(err)}))})
                    await client.users.fetch(input1.slice(2).slice(0,-1)).catch((err) => {
                        error = true; 
                        return message.channel.send({embeds:[error_embed('Usuário inexistente')]}).catch((err)=> {})
                    })
                    .then(()=>message.delete().catch((err) => {}))
                    if(error == true) return
                    
                    //canvas
                    const avatar1 = await Canvas.loadImage(client.users.cache.get(userA).displayAvatarURL({ format: 'jpg', size:512})).catch((err)=>{console.error(err)})
                    ctx.drawImage(avatar1, 0, 0, 128, 128)
                    const avatar2 = await Canvas.loadImage(client.users.cache.get(userB).displayAvatarURL({ format: 'jpg', size:512})).catch((err)=>{console.error(err)})
                    ctx.drawImage(avatar2, 138, 0, 128, 128)
                    const reaction = await Canvas.loadImage('./dataBase/assets/vs.png')
                    ctx.drawImage(reaction, 0, 0, 266, 128)
                    const border = await Canvas.loadImage('./dataBase/assets/border.png')
                    ctx.drawImage(border, 0, 0, 266, 128)
                    attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'test.png' });
                } catch (err){ 
                    console.log(err);return await message.channel.send({content: `Error 0 - Canvas image`})
                    .then(()=>{error = true}) 
                }
            }
                await firstbabe()
                if(error == true) return
                embed = new EmbedBuilder()
                    .setDescription(`👋 Olá <@${userB}> 🎈\n♦ <@${userA}> está te convidando para jogar!! ♦ \n\n⭐ Clique no 👍 para jogar junto ou contra ele(a) ⭐`)
                    .setColor('#FF0000')
                    .setImage(`attachment://test.png`)
                    .setFooter({text:`📌Dica: para iniciar sem passar nos menus digite g!jogar @usuario nome_do_jogo, exemplo: g!jogar @matheusFortnite matgame\n📌Para consultar os nomes dos jogos digite g!ids`})
                    try{
                    message.channel.send({content:`<@${userB}>,<@${userA}>`,embeds: [embed], files:[attachment] }).then(msg => {
                        originalmsg = msg
                        msg.react('👍').then(() => {
                    //espera a resposta do desafiado
                    const collector = msg.createReactionCollector({ filter, time: 30000, max:1 });
    
                    collector.on('collect', async (reaction, user) => {
                        originalmsg.removeAttachments()
                        await originalmsg.reactions.removeAll().catch(err => {})
                        for(let i = 0; i < 2; i++){
                            await originalmsg.react(`${reactions[i]}`)
                        }
                        GAME_MENU()
                    });
                    collector.on('end', collected => {
                    });
                })})
                }
                catch(err){
                    console.log(err)
                    message.channel.send('Error 1 - Sending message')
                }
        }
        //menu SOLO/GERAL
        if(input1 === undefined){

            let reactions = ['1️⃣','2️⃣']
            let GAME_MODES = [
                "1️⃣ Sozinho",
                "2️⃣ Aberto a todos (no canal)"
            ]
            let text = `♦ Escolha um modo de jogo ♦\n\n`

            for(let i = 0; i < GAME_MODES.length; i++){
                text = text + `${blacked}${GAME_MODES[i]}${blacked}\n`
            }
            embed = new EmbedBuilder()
            .setDescription(`${text}`)
            .setColor('#adff2f')
            .setFooter({text:`📌 Reaja aqui em baixo ⬇⬇`})
            originalmsg = await message.channel.send({embeds:[embed]})

            for(let i = 0; i < 2; i++){
                await originalmsg.react(`${reactions[i]}`)
            }

            const filter = (reaction, user) => {
                collected = reaction.emoji.name
                correct = false
                for(let i = 0; i < reactions.length; i++){
                    if(reaction.emoji.name === reactions[i]){
                        correct = true
                    }
                }
                return correct === true && user.id === (userA);
            };
            const collector = originalmsg.createReactionCollector({ filter, time: 30000, max:1 });
            collector.on('collect', (reaction, user) => {
                if(collected === '1️⃣'){
                    players.push(userId)
                    GAME_INFO.type = 'solo'
                    GAME_INFO.input1 = 'N/A'
                    GAME_INFO.caller = userId
                    GAME_INFO.options = 'N/A'
                    GAME_INFO.players = [`${userId}`]
                    GAME_MENU()
                }
                if(collected === '2️⃣'){
                    players.push(userId)
                    GAME_INFO.type = 'grupo'
                    GAME_INFO.input1 = 'N/A'
                    GAME_INFO.caller = userId
                    GAME_INFO.options = 'N/A'
                    GAME_INFO.players.push(userId)
                    originalmsg.edit({embeds:[InvitingEmbed(GAME_INFO.caller)]})
                    .then(() =>{
                        originalmsg.react('😳')
                        .then(()=>{
                            const filter = (reaction, user) => {
                                let username = ''
                                let gather = async () => {
                                    if(user.bot){
                                        return false
                                    }
                                    username = await originalmsg.channel.send({embeds:[JoinEmbed(client.users.cache.get(user.id).username)]})
                                    players.push(user.id)
                                    GAME_INFO.players.push(user.id)
                                }
                                add = true
                                for(let i = 0; i < players.length; i++){
                                    if(user.id === players[i]){
                                        add = false
                                    }
                                }
                                if(add === true){
                                    gather()
                                }
                                return add === true;
                            };
                            const collector = originalmsg.createReactionCollector({ filter, time: 15000, max:10 });
                            collector.on('collect', (reaction, user) => {
                            })
                            collector.on('end', collected => {
                                GAME_MENU()
                            });  
                        })
                    })
                }
            })
            collector.on('end', collected => {
            });  
        }
    }
}