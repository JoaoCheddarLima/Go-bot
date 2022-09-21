const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const fs = require('fs')
const { AttachmentBuilder } = require('discord.js');
const { ImageEmbed2, justAText } = require("../reuse/games/global");
const { analize } = require("./analize");
module.exports = async (client) => {
    const [width, height, color] = [300,300,'white']
    const chartJSNodeCanvas = new ChartJSNodeCanvas({width,height,color})
    let text
    const dados = JSON.parse(fs.readFileSync('../Nano/Nanobot/data.json'))

    const channel = client.channels.cache.get("1022035517753266186");
    const channel2 = client.channels.cache.get("1022035569397727313");
    const channel3 = client.channels.cache.get("1022241966274138242")
    let passDias 
    let oldData = JSON.parse(fs.readFileSync('./src/dataGraphs/oldData/oldData.json'))
    let genGraf = (labels, info, nome, tipo)=>{
        let type = 'bar'
        const data = {
        labels: labels,
        datasets: [{
            label: nome,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: info,
        }]
        };
        const config = {
            type: type,
            data: data,
        };
        let converter = async () => {
            let link = chartJSNodeCanvas.renderToBufferSync(config)
            return link
        }
        return converter()
    }
    let average = async () => {
        let labels = []
        let info = []
        let total = {}
        let divisor = 1
        for(let dia in dados){
            for(let hora in dados[dia]){
                if(total[hora] === undefined){
                    total[hora] = dados[dia][hora]
                }else{
                    total[hora] += Number(dados[dia][hora])
                }
            }
            divisor+=1
        }
        for(const key in total){
            labels.push(key)
            info.push(Math.floor(total[key]/divisor))
        }
        total["arrayFR"] = info 
        oldData[divisor] = total
        passDias = divisor
        fs.writeFileSync('./src/dataGraphs/oldData/oldData.json', JSON.stringify(oldData, null, 2))
        return await genGraf(labels, info, `Atividade média por hora dos ultimos: ${divisor} dias`, 'media')
    }
    let daily = async (day) => {
        let labels = []
        let info = []
        let dia = String(day)

        for(let key in dados[dia]){
            labels.push(key)
            info.push(dados[dia][key])
        }
        text = analize(info, passDias)
        return await genGraf(labels,info, `Atividade geral nas ultimas 12h`, 'diario')
    }
    
    attachment2 = new AttachmentBuilder(await average(), { name: 'average.png' });
    attachment1 = new AttachmentBuilder(await daily(new Date().getDate()), { name: 'daily.png' });
    await channel2.send({embeds:[ImageEmbed2('average.png')], files:[attachment2]})
    await channel.send({embeds:[ImageEmbed2('daily.png')], files:[attachment1]})
    await channel3.send({embeds:[justAText(text)]})
}