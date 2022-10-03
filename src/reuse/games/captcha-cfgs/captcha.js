const { genCene } = require('./utils.js')
const blank = '◼'
const player = '🤠'
const goal = '🎯'
const border = '◻'

this.updateMove = async (moveid, mapa) => {
    let moves = {
        0:'left',
        1:'up',
        2:'down',
        3:'right'
    }
    let newMapa = await this.moveTo(moves[moveid], mapa)
    if(newMapa === false){
        return false
    }else{
        return newMapa
    }
}

this.moveTo = async (move, mapa) => {
    let where = await this.getPlayerPosition(mapa)
    if(move === 'up' && where.linha - 1 > -1){
        if(mapa[0,where.linha - 1][where.elemento] === false){
            return true
        }
        mapa[0,where.linha -1][where.elemento] = true
        mapa[0,where.linha][where.elemento] = null
        return mapa
    }
    if(move === 'down' && where.linha + 1 < mapa[0].length){
        if(mapa[0,where.linha + 1][where.elemento] === false){
            return true
        }
        mapa[0,where.linha +1][where.elemento] = true
        mapa[0,where.linha][where.elemento] = null
        return mapa
    }
    if(move === 'right' && where.elemento + 1 < mapa[0,where.linha].length){
        if(mapa[0,where.linha][where.elemento + 1] === false){
            return true
        }
        mapa[0,where.linha][where.elemento + 1] = true
        mapa[0,where.linha][where.elemento] = null
        return mapa
    }
    if(move === 'left' && where.elemento - 1 > -1){
        if(mapa[0,where.linha][where.elemento - 1] === false){
            return true
        }
        mapa[0,where.linha][where.elemento - 1] = true
        mapa[0,where.linha][where.elemento] = null
        return mapa
    }
    return false
}

this.checkwin = (cords) => {
    if(cords === false){
        return true
    }
}

this.getPlayerPosition = (mapa) => {
    let position = {
        linha:null,
        elemento:null
    }
    for(linha in mapa){
        
        for(elemento in mapa[linha]){
            if(mapa[linha][elemento] === true){
                position.linha = Number(linha)
                position.elemento = Number(elemento)
            }
        }
    }
    return position
}

this.translate_to_emoji = async (map) => {
    let mapa = []
    for(key in map){
        mapa.push([...map[key]])
    }
    for(linha in mapa){
        mapa[linha].push(border)
        mapa[linha].unshift(border)
        for(elemento in mapa[linha]){
            if(mapa[linha][elemento] === null){
                mapa[linha][elemento] = blank
            }
            if(mapa[linha][elemento] === true){
                mapa[linha][elemento] = player
            }
            if(mapa[linha][elemento] === false){
                mapa[linha][elemento] = goal
            }
        }
    }
    let max = mapa[0,0].length
    let borders = []
    for(let i = 0; i < max; i++){
        borders.push(border)
    }
    mapa.push(borders)
    mapa.unshift(borders)
    return mapa
}

this.gameDisplay = async (mapa) => {
    let map = await this.translate_to_emoji(mapa)
    let text = ''
    for(linha in map){
        for(elemento in map[linha]){
            text+=map[linha][elemento]
        }
        text+='\n'
    }
    return text
}

this.createGameInstance = async (x,y) => {
    let mapa = await genCene(x,y)
    return mapa
}