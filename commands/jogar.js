const fs = require('fs')
const Canvas = require('@napi-rs/canvas')
const { insight } = require('../reuse/functions')
const { GenQuestions, QuestionEmbed, CorrectAnswer, GameOverEmbed, PauseEmbed, LevelUpEmbed } = require('../reuse/games/mathquestions.js')
const {EmbedBuilder, AttachmentBuilder} = require('discord.js')
const { error_embed } = require('../reuse/error-embed')

module.exports = {
    name:"jogar",
    async execute(message,args, client, input1, input2, userId, input3, input4){
        if(!input1) return
        let error = false
        if(input1.length !== userId.length+3){
        error = true
        await message.channel.send({embeds:[error_embed('por favor marque um usuário válido')]})
        .then(() => message.delete().catch((err) => {console.error(err)}))
        }
        if(userId === input1.slice(2).slice(0,-1)) return message.channel.send({embeds:[error_embed('ainda não pode jogar sozinho')]}).then(() => message.delete().catch((err) => {console.error(err)}))
        if(error == true) return
        //data collector
        insight('jogar')
        //variables
        let pontos_userA = 0
        let pontos_userB = 0
        let points = 0
        let correct 
        let LEVEL_UP = false
        let LEVEL_UP_EMBED 
        let originalmsg 
        let level = 1
        let round = 1
        let attachment
        let embed
        let userA = userId  
        let userB = input1.slice(2).slice(0,-1)
        let userA_Name = await client.users.cache.get(userA).username
        let userB_Name = await client.users.cache.get(userB).username
        console.log(userA_Name, userB_Name)
        //MATHGAME
            let mathGame = async () => {  
            let newquestion = GenQuestions(level)
            let game = async () => {
                let questionmsg = await message.channel.send({content: `<@${userB}>, <@${userA}>`,embeds:[QuestionEmbed(round, newquestion.question, newquestion.level)]})
                const filter = m => {
                    response = Number(m.content)
                    correct = m
                    if(response === newquestion.result && (m.author.id === userA || m.author.id === userB)) return true
                    return false
                };
                questionmsg.channel.awaitMessages({ filter, max: 1, time: 20000 + level * 10000, errors: ['time'] })
                .then(collected => {
                    if(correct.author.id === userA){
                        pontos_userA += newquestion.result
                    }
                    if(correct.author.id === userB){
                        pontos_userB += newquestion.result
                    }
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
                    message.channel.send({embeds: [GameOverEmbed(newquestion.result,userA_Name, userB_Name, points, round, level, pontos_userA, pontos_userB)]})
                });
            }
                if(round === 1){
                    game()
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
                }
            }//end math game

        //challenging
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
                const collector = msg.createReactionCollector({ filter, time: 30000 });

                collector.on('collect', (reaction, user) => {
                    let blacked = '```'
                    let it = async () => {
                    await originalmsg.reactions.removeAll()
                    await originalmsg.removeAttachments()
                    }
                    it()
                    embed = new EmbedBuilder()
                    .setDescription(`🎈 <@${userA}> escolha um jogo!! 🎈 \n\n${blacked}1️⃣ - Matematica 1v1${blacked}`)
                    .setColor('#adff2f')
                    .setFooter({text:`📌 Reaja aqui em baixo ⬇⬇`})
                    originalmsg.edit({embeds: [embed]}).then(original => {
                        msg.react('1️⃣')
                    })

                    const filter = (reaction, user) => {
                        return reaction.emoji.name === '1️⃣' && user.id === (userA);
                    };

                    const collector = msg.createReactionCollector({ filter, time: 30000 });
                    collector.on('collect', (reaction, user) => {
                        if(collected = '1️⃣'){
                            let segundos = 15
                            embed = new EmbedBuilder()
                            .setDescription(`👾 Jogo escolhido - Matematica 1v1 👾\n\n⏰ Começa em ${segundos} segundos⏰\n\n❓ Como jogar ❓\n♦ Cada questão tem 30 segundos ⏰ de duração ✅\n♦ Caso não acertem ❌ o jogo acaba`)
                            .setColor('#00FF00')
                            .setFooter({text:'⭐ Dica: você pode desativar este guia rápido digitando g!guia mat e ativar novamente utilizando g!guia mat ⭐'})
                            originalmsg.edit({embeds: [embed]})
                            setTimeout(() => {mathGame();originalmsg.delete().catch((err)=>{})}, segundos * 1000)
                        }
                    })
                    collector.on('end', collected => {
                    });
                    

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
}