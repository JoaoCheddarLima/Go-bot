const fs = require('fs')

this.analize = (infoarr, dia) => {
    let actualData = JSON.parse(fs.readFileSync('./src/dataGraphs/oldData/oldData.json'))
    let text
    const [Dia, horas, minutos] = [new Date().getDay(),new Date().getHours(), new Date().getMinutes()]
    const hora = `Dia: ${Dia} - ${horas < 10? 0+String(horas): horas}:${minutos < 10? 0+String(minutos): minutos}.`
    text = `⏰ ${hora} ⏰\n`
    for(key in infoarr){
        let average = actualData[dia]["arrayFR"]
        actualDaily = Number(infoarr[key])
        actualAverage = Number(average[key])
        let check = a => a < 10? 0+String(a):a
        if(actualDaily === actualAverage){
            text += `🔹 Atividade no horário: ${check(key)}h está na média de atividades, [AT: ${actualDaily}] == [MD: ${actualAverage}}\n`
            continue
        }
        if(actualDaily > actualAverage){
            text+=`📌 ${check(key)}h |⭐+ ${Math.floor((actualDaily *100)/(actualAverage === 0? 1: actualAverage)) - 100}% [Total= +${actualDaily - actualAverage}]\n`
        }else{
            text+=`📌 ${check(key)}h |❗..- ${100 - Math.floor((actualDaily *100)/(actualAverage === 0? 1: actualAverage))}% [Total= ${actualDaily - actualAverage}]\n`
        }
    }
    return text
}