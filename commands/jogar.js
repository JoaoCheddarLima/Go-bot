const fs = require('fs')
const Canvas = require('@napi-rs/canvas')
const { insight } = require('../reuse/functions')
const { GenQuestions, QuestionEmbed, CorrectAnswer, GameOverEmbed, PauseEmbed, LevelUpEmbed, InvitingEmbed, JoinEmbed } = require('../reuse/games/mathquestions.js')
const {EmbedBuilder, AttachmentBuilder} = require('discord.js')
const { error_embed } = require('../reuse/error-embed')

module.exports = {
    name:"jogar",
    async execute(message,args, client, input1, input2, userId, input3, input4){
        //data collector
        insight('jogar')
        //variables
        let GAME_INFO = {
            caller:'',
            input1:'',
            type:'',
            players:'',
            end:''
        }
        let error = false
        let collected
        let blacked = '```'
        let points = 0
        let tabela_pontos = {}
        let correct 
        let LEVEL_UP = false
        let originalmsg 
        let level = 1
        let round = 1
        let attachment
        let embed
        let userA = userId  
        let userB 
        let userA_Name
        let userB_Name
        let questionmsg 
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
                if(userId === input1.slice(2).slice(0,-1)) return message.channel.send({embeds:[error_embed('ainda não pode jogar sozinho')]}).then(() => message.delete().catch((err) => {console.error(err)}))
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
        //MATHGAME
            let mathGame = async () => {  
                if(round === 1){
                    console.log(players)
                    for(key of players){
                        tabela_pontos[`${key}`] = {
                            username: await client.users.cache.get(key).username,
                            points: 0
                        }
                    }
                    GAME_INFO.end = tabela_pontos
                }
            let newquestion = GenQuestions(level)
            let game = async () => {
                let marcar = ''
                for(let i = 0; i < players.length; i++){
                    marcar = marcar + `<@${players[i]}>,`
                }
                questionmsg = await message.channel.send({content: `${marcar}`,embeds:[QuestionEmbed(round, newquestion.question, newquestion.level)]})
                
                const filter = m => {
                    response = Number(m.content)
                    let IS_PLAYER = false
                    correct = m
                    for(let i = 0; i < players.length; i++){
                        if(players[i] === m.author.id){
                            IS_PLAYER = true
                            break
                        }
                    }
                    if(response === newquestion.result && IS_PLAYER === true) return true
                    return false
                };

                questionmsg.channel.awaitMessages({ filter, max: 1, time: 20000 + level * 10000, errors: ['time'] })
                .then(collected => {

                    tabela_pontos[correct.author.id].points += newquestion.result
                    points += newquestion.result
                    round++
                    message.channel.send({embeds:[CorrectAnswer(client.users.cache.get(correct.author.id).username, newquestion.result)]}).catch((err) => {return})
                    .then(() => {
                        if(round/10 === 1){
                            level++
                            LEVEL_UP = true
                        }
                        if(round/20 === 1){
                            level++
                            LEVEL_UP = true
                        }
                    })
                    .then(() => mathGame())
                }).catch(collected => {
                    message.channel.send({embeds: [GameOverEmbed(newquestion.result, points, round, level, GAME_INFO)]})
                });
            }
                if(round > 1){
                    let tempo = 3000 + level * 2000
                    let PAUSE_EMBED = await message.channel.send({embeds:[PauseEmbed(tempo)]})
                    if(LEVEL_UP === true){
                        await message.channel.send({embeds:[LevelUpEmbed(level)]})
                        LEVEL_UP = false
                    }
                    setTimeout(() => {
                        PAUSE_EMBED.delete().catch((err) => {})
                        game()
                    }, tempo)
                }else{
                    game()
                }
            }
        //end math game

        //menu selecionar jogos
        let GAME_MENU = async () => {
            collected = ''
            let blacked = '```'
            
            await originalmsg.reactions.removeAll()

            embed = new EmbedBuilder()
            .setDescription(`🎈 <@${GAME_INFO.caller}> escolha um jogo!! 🎈 \n\n${blacked}1️⃣ - Matematica quiz (soma)${blacked}`)
            .setColor('#adff2f')
            .setFooter({text:`📌 Reaja aqui em baixo ⬇⬇`})
            originalmsg.edit({embeds: [embed]}).then(original => {
                original.react('1️⃣')
            })

            const filter = (reaction, user) => {
                if(reaction.emoji.name === '1️⃣' && user.id === (GAME_INFO.caller)){
                    collected = reaction.emoji.name
                    return true
                }
                return false
            };
            const collector = originalmsg.createReactionCollector({ filter, time: 30000, max:1 });
            collector.on('collect', (reaction, user) => {
                if(collected === '1️⃣'){
                    originalmsg.reactions.removeAll().catch(err => {})
                    let segundos = 15
                    embed = new EmbedBuilder()
                    .setDescription(`👾 Matematica quiz (soma) 👾\n\n⏰ Começa em ${segundos} segundos⏰\n\n❓ Como jogar ❓\n♦ Irei enviar questões❓ \n♦ Cada questão tem: ⏰ 30 segundos de duração ♦\n♦ Caso não acertem ❌ o jogo acaba`)
                    .setColor('#00FF00')
                    .setFooter({text:'⭐ Dica: você pode desativar este guia rápido digitando g!guia mat e ativar novamente utilizando g!guia mat ⭐'})
                    originalmsg.edit({embeds: [embed]})
                    setTimeout(() => {
                        mathGame();
                        originalmsg.delete()
                        .catch((err)=>{})}, segundos * 1000)
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
    
                    collector.on('collect', (reaction, user) => {
                        originalmsg.removeAttachments()
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

            for(let i = 0; i < reactions.length; i++){
                originalmsg.react(`${reactions[i]}`)
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
                originalmsg.reactions.removeAll().catch(err => {})
                if(collected === '1️⃣'){
                    players.push(userId)
                    GAME_INFO.type = 'solo'
                    GAME_INFO.input1 = 'N/A'
                    GAME_INFO.caller = userId
                    GAME_INFO.options = 'N/A'
                    GAME_MENU()
                }
                if(collected === '2️⃣'){
                    players.push(userId)
                    GAME_INFO.type = 'grupo'
                    GAME_INFO.input1 = 'N/A'
                    GAME_INFO.caller = userId
                    GAME_INFO.options = 'N/A'
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
                            const collector = originalmsg.createReactionCollector({ filter, time: 30000, max:10 });
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