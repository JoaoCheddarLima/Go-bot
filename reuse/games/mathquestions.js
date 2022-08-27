const { EmbedBuilder} = require('discord.js')

this.GameOverEmbed = (result, userA, userB, points, round, level, points_player1, points_player2) => {
    const embedtogo = new EmbedBuilder()
    .setColor('#7600bc')
    .setFooter({text: `👾 -GAME OVER- 🎃\n⏰ Acabou o tempo ⏰\n🤣 A resposta era ${result}\n\n🎯 Pontuação: ${points}\n📝 Perguntas: ${round}\n 🎃 Dificuldade: ${level}\n✨ Jogador 1: ${userA}\n😎 Pontos: ${points_player1}\n✨ Jogador 2: ${userB}\n😎 Pontos: ${points_player2}`,iconURL:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCp5UetIsS9fOFLOFssQKc8MQNce3ZYi1gCQ&usqp=CAU'});
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
            descriptiontext =  `🔥 Questão: ${round} 🧠🧠🧠\n\n🌎 ${question}\n\n🎃 Dificuldade  ${level}`
            footertext = 'daqui pra frente é loucura 🤪'
            color = 'FF0000'
            return
        }
        if(level === 2){
            descriptiontext =  `😎 Questão: ${round} 🧠🧠\n\n🌎 ${question}\n\n🎃 Dificuldade  ${level}`
            footertext = 'eita vários numeros 🤭'
            color = 'FFFF00'
            return
        }
        footertext = `-- 30 segundos para responder --`
        descriptiontext = `🧠 Questão: ${round}\n\n🌎 ${question}\n\n🎃 Dificuldade  ${level}`
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