const fs = require('fs')
const {AttachmentBuilder, Attachment} = require('discord.js')
const Canvas = require('@napi-rs/canvas')
const { turnChangeEmbedVelha, findLocal, checkWin, drawEmbed, winnerEmbed } = require('../reuse/games/VelhaConfigs')
const { PlayAgain, ImageEmbed } = require('../reuse/games/global')
module.exports = async (players,GAME_INFO,client,message) => {
    //variables
    let temp = [...GAME_INFO.players]
    let originalmsg
    let text
    let reactions = ['✅','❌']
    let player1
    let player2
    let editcanvas 
    let esc
    let full
    let attachments
    let counter = 0
    let background
    let possibilities = [1,2,3,4,5,6,7,8,9]
    let toplay = []
    let tabuleiro = [[null, null, null],[null, null, null],[null, null, null]]
    let rounds = 0
    let escolha = (num, embape) => {
        let fileira = 0
        let pos = 0
        while(num > 3){
            num -= 3
            fileira += 1 
        }
        while(num > 0){
            num -= 1
            pos += 1
        }
        tabuleiro[0,fileira][pos-1] = embape
    }

    let sorteio = () => {
        player1 = Math.floor(Math.random()*temp.length)
        toplay.push(temp[player1])
        toplay.push(temp[player1 === 0? 1 : 0])
        return {
            player1:{
                id:toplay[0],
                type:'x'
            },
            player2:{
                id:toplay[1],
                type:'y'
            }
        }
    }
    //display
    let displayDraw = async (type, choose) =>{
        const canvas = Canvas.createCanvas(144,144)
        const board = canvas.getContext('2d')
        let coords = findLocal(choose)
        if(rounds === 0){
            background = await Canvas.loadImage('./src/dataBase/assets/Tic-tac-toe.png');
            board.drawImage(background, 0, 0, canvas.width, canvas.height);
        }else{
            background = originalmsg.embeds[0].data.image.url
            board.drawImage((await Canvas.loadImage(background)), 0, 0, canvas.width, canvas.height);
            board.drawImage((await Canvas.loadImage(`./src/dataBase/assets/${type}.png`)), coords['x'], coords['y'], 32, 32)
        }
        attachments = new AttachmentBuilder(await canvas.encode('png'), { name: 'test.png' }); 
    }
    //game
    let restart = async () => {
        let originalmsg = await message.channel.send(PlayAgain(await client.users.cache.get(GAME_INFO.caller).username)).catch(err => {})
        for(let i = 0; i < reactions.length; i++){
            originalmsg.react(reactions[i]).catch(err => {})
        }
        const filter = (reaction, user) => {
            if(reactions.indexOf(reaction.emoji.name) !== -1 && user.id === (GAME_INFO.caller)){
                collected = reaction.emoji.name
                return true
            }
            return false
        };
        const collector = originalmsg.createReactionCollector({ filter, time: 30000, max:1 });
        collector.on('collect', (reaction, user) => {
            if(reaction.emoji.name === '✅'){
                game()
            }else{
                return
            }
        })
        collector.on('end', collected => {
        });
    }
    let game = async () => {
        let players = sorteio()
        let newRound = async (simb, choose) => {
            let mark = `<@${toplay[0]}>`
            if(toplay.length === 0){
                toplay = [...temp]
            }
            await displayDraw(simb,choose)
            if(originalmsg === undefined){
                originalmsg = await message.channel.send({content:`||${mark}||`,embeds:[turnChangeEmbedVelha(client.users.cache.get(toplay[0]).username, possibilities)], files:[attachments] })
            }else{
                console.log(toplay)
                await originalmsg.edit({content:`||${mark}||`,embeds:[turnChangeEmbedVelha(client.users.cache.get(toplay[0]).username, possibilities)], files:[attachments] })
            }
            const filter = async m => {
                counter++
                console.log(counter)
                if(counter === 6){
                    await originalmsg.delete().catch(err => {})
                    originalmsg = await message.channel.send({content:`||${mark}||`,embeds:[turnChangeEmbedVelha(client.users.cache.get(toplay[0]).username, possibilities)], files:[attachments] })
                    counter = 0
                }
                if(m.author.id !== toplay[0]) return false
                if(possibilities.indexOf(Number(m.content)) === -1) return false
                esc = Number(m.content)
                full = m
                counter-=1
                await m.delete().catch(err => {})
                possibilities.splice(possibilities.indexOf(esc), 1)
                return true
            };
            message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] })
            .then(async collected => {
                if(rounds < 9){
                    let who = players.player1.id === full.author.id ? players.player1.type : players.player2.type
                    escolha(esc, who)
                    if(checkWin(who, tabuleiro) === true){
                        await originalmsg.delete().catch(err => {})
                        await displayDraw(who,esc).then(async () => {
                            await message.channel.send({content:`||${mark}||`,embeds:[ImageEmbed(),winnerEmbed(client.users.cache.get(toplay[0]).username,rounds)], files:[attachments] })
                        })
                        restart()
                    }else{
                        toplay.splice(0,1)
                        await newRound(who, esc)
                    }
                }else{
                    let who = players.player1.id === full.author.id ? players.player1.type : players.player2.type
                    await displayDraw(who,esc)
                    await message.channel.send({content:`||${mark}||`,embeds:[drawEmbed()], files:[attachments] })
                    restart()
                }
            }).catch(collected => {
                message.channel.send('erro')
                console.log(collected)
            });
            rounds++
            console.log(rounds)
        }
        newRound()
    }
    game()
}