const fs = require('fs')
const Canvas = require('@napi-rs/canvas')
const { insight } = require('../reuse/functions')
const { GenQuestions, QuestionEmbed, CorrectAnswer, GameOverEmbed } = require('../reuse/games/mathquestions.js')
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
            let questionmsg = await message.channel.send({content: `<@${userB}>, <@${userA}>`,embeds:[QuestionEmbed(round, newquestion.question, newquestion.level)]})
            const filter = m => {
                console.log(m.content)
                console.log(newquestion.result)
                response = Number(m.content)
                correct = m
                if(response === newquestion.result && (m.author.id === userA || m.author.id === userB)) return true
                return false
            };
            message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
            .then(collected => {
                if(correct.author.id === userA){
                    pontos_userA += newquestion.result
                }
                if(correct.author.id === userB){
                    pontos_userB += newquestion.result
                }
                points += newquestion.result
                round++
                if(round/10 === 1){
                    level++
                }
                if(round/20 === 1){
                    level++
                }
                message.channel.send({embeds:[CorrectAnswer(client.users.cache.get(correct.author.id).username, newquestion.result)]}).catch((err) => {return})
                .then(() => mathGame())
            }).catch(collected => {
                message.channel.send({embeds: [GameOverEmbed(newquestion.result,userA_Name, userB_Name, points, round, level, pontos_userA, pontos_userB)]})
            });
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
                .setTitle('menu pré jogo')
                .setDescription(`Olá <@${userB}> 👋, <@${userA}> está te convidando para jogar, clique no 👍 para aceitar o convite`)
                .setColor('#FF0000')
                .setImage(`attachment://test.png`)
                .setFooter({text:`Rapaziada manda um milkshake aq em casa 💔 q o bglh ta loco, cabo o café`})
                try{
                message.channel.send({content:`<@${userB}>,<@${userA}>`,embeds: [embed], files:[attachment] }).then(msg => {
                    originalmsg = msg
                    msg.react('👍').then(() => {
                //espera a resposta do desafiado
                const collector = msg.createReactionCollector({ filter, time: 30000 });

                collector.on('collect', (reaction, user) => {
                    let it = async () => {
                    await originalmsg.reactions.removeAll()
                    await originalmsg.removeAttachments()
                    }
                    it()
                    embed = new EmbedBuilder()
                    .setTitle('menu pré jogo')
                    .setDescription(`<@${userA}> Escolha um jogo\n\n1️⃣ - Matematica 1v1`)
                    .setColor('#0000FF')
                    .setFooter({text:`Reaja aqui em baixo`})
                    originalmsg.edit({embeds: [embed]}).then(original => {
                        msg.react('1️⃣')
                    })

                    const filter = (reaction, user) => {
                        return reaction.emoji.name === '1️⃣' && user.id === (userA);
                    };

                    const collector = msg.createReactionCollector({ filter, time: 30000 });
                    collector.on('collect', (reaction, user) => {
                        if(collected = '1️⃣'){
                            originalmsg.delete().catch((err) => {message.channel.send('ops, tentei apagar uma mensagem e algo deu errado').catch((error) => {})})
                            mathGame()
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