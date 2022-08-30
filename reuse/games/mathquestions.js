const {EmbedBuilder, AttachmentBuilder} = require('discord.js')
const { error_embed } = require('../error-embed')

this.JoinEmbed = (username) => {
    const embedtogo = new EmbedBuilder()
    .setColor('#00FF00')
    .setFooter({text: `🎈 ${username} entrou!`});
    return embedtogo
}
this.InvitingEmbed = (caller) => {
    let text = `♦ ATENÇÃO! ♦\n<@${caller}> está criando uma partida aberta`
    const embedtogo = new EmbedBuilder()
    .setColor('#FF0000')
    .setFooter({text: `\n♦- Encerra em 30 segundos -♦\n⬇⬇ REAJA PARA PARTICIPAR ⬇⬇`});
    return embedtogo
}
this.LevelUpEmbed = (level) => {
    const embedtogo = new EmbedBuilder()
    .setColor('#FFFF00')
    .setFooter({text: `♦ Dificuldade aumentada ✨${level - 1 } ==> ${level}✨\n⏳ Maior tempo entre questões e para respostas`,iconURL:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCp5UetIsS9fOFLOFssQKc8MQNce3ZYi1gCQ&usqp=CAU'});
    return embedtogo
}

this.PauseEmbed = (tempo) => {
    const embedtogo = new EmbedBuilder()
    .setColor('#FFFF00')
    .setFooter({text: `🎈 Pensando em uma nova questão 🎈\n - T:${tempo/1000} -`,iconURL:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCp5UetIsS9fOFLOFssQKc8MQNce3ZYi1gCQ&usqp=CAU'});
    return embedtogo
}
this.GameOverEmbed = (result, points, round, level, GAME_INFO) => {
    let text = ''
    console.log(GAME_INFO+'\n\n\n')
    console.log(GAME_INFO.end)
    if(GAME_INFO.type === 'solo'){
        text = `🎯 Sua Pontuação: ${points}\n📝 Perguntas: ${round}\n 🎃 Dificuldade: ${level}`
    }else{
        text = `🎯 Pontuação total: ${points}\n📝 Perguntas: ${round}\n 🎃 Dificuldade: ${level}\n\n`
        let i = 1
        for(key in GAME_INFO.end){
        text = text + `✨ Jogador ${i}: ${GAME_INFO.end[key].username}\n🎯Pontos: ${GAME_INFO.end[key].points}\n`
        i++
        }
    }
    const embedtogo = new EmbedBuilder()
    .setColor('#7600bc')
    .setFooter({text: `👾 -GAME OVER- 🎃\n⏰ Acabou o tempo ⏰\n🤣 A resposta era ${result}\n\n${text}`,iconURL:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCp5UetIsS9fOFLOFssQKc8MQNce3ZYi1gCQ&usqp=CAU'});
    return embedtogo
}

this.CorrectAnswer = ( username, answer ) => {
    const embedtogo = new EmbedBuilder()
    .setColor('#00FF00')
    .setFooter({ text: `✅ ${username} acertou, resposta ${answer}`});
    return embedtogo
}

this.QuestionEmbed = (round, question, level) => {
    let color 
    let descriptiontext
    let footertext
    let chooseone = async () => {
        if(level >= 3){
            descriptiontext =  `🔥 Questão: ${round} 🧠🧠🧠\n⚙ Dificuldade  ${level} ⚙\n\n⭐ ${question} ⭐`
            footertext = '🤪 daqui pra frente é loucurakkk 🤪\n-- 50 segundos para responder --'
            color = 'FF0000'
            return
        }
        if(level === 2){
            descriptiontext =  `♦ Questão: ${round} 🧠🧠\n⚙ Dificuldade  ${level} ⚙\n\n⭐ ${question} ⭐`
            footertext = '🤭 eita vários numeros 🤭\n-- 40 segundos para responder --'
            color = 'FFFF00'
            return
        }
        footertext = `-- 30 segundos para responder --`
        descriptiontext = `♦   Questão: ${round} 🧠\n⚙ Dificuldade  ${level} ⚙\n\n⭐ ${question} ⭐`
        color = '0000FF'
    }
    chooseone()
    const embedtogo = new EmbedBuilder()
    .setColor(color)
    .setDescription(descriptiontext)
    .setFooter({ text: footertext});
    return embedtogo
}



this.GenQuestions = (level) => {
    let MAX_SUMVALUE = 100
    let MIN_SUMVALUE = 0
    let LEVEL_SUMVALUE
    let questioninfo = {
        'question':``,
        'level':'',
        'result':'',
        'NumbersArray':''
    }
    let questionString = ''
    let sumAll = 0
    let difficult = level
    let numbers = []
    
	while(difficult > 0){
        LEVEL_SUMVALUE = MAX_SUMVALUE * level 
        numbers.push(Math.round(Math.random() * Number(LEVEL_SUMVALUE)))
        numbers.push(Math.round(Math.random() * Number(LEVEL_SUMVALUE)))
        difficult--
	}
    for(let i = 0; i < numbers.length; i++){
        if(i === numbers.length - 1){
            sumAll += numbers[i]
            questionString = questionString + numbers[i] + ' ? '
            break
        }
        sumAll += numbers[i]
        questionString = questionString + numbers[i] + ' + '
    }
    questioninfo.question = questionString
    questioninfo.level = level
    questioninfo.result = sumAll
    questioninfo.NumbersArray = numbers
    return questioninfo
}