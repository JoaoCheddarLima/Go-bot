this.genMapa = (x = 5,y = 5) => {
    let mapa = []
    for(let linha = 0; linha < y; linha++){
        mapa.push([])
        for(let elementos = 0; elementos < x; elementos++){
            mapa[0,linha].push(null)
        }
    }
    return mapa
}

this.setGoal = (mapa) => {
    let total = 0
    let linhas = 0
    for(linha of mapa){
        total+= linha.length
        linhas++
    }
    let position = total/linhas

    let randomY = Math.floor(Math.random() * (linhas - 1) + 1)
    let randomX = Math.floor(Math.random() * (position - 1) + 1)

    mapa[0,randomY][randomX] = true
    return mapa
}

this.spawnPlayer = (mapa) => {
    let total = 0
    let linhas = 0
    for(linha of mapa){
        total+= linha.length
        linhas++
    }
    let position = total/linhas

    let randomY = Math.floor(Math.random() * (linhas - 1) + 1)
    let randomX = Math.floor(Math.random() * (position - 1) + 1)

    if(mapa[0,randomY][randomX] === true){
        while(mapa[0,randomY][randomX] === true){
            randomY = Math.floor(Math.random() * (linhas - 1) + 1)
            randomX = Math.floor(Math.random() * (position - 1) + 1)
        }
    }
    mapa[0,randomY][randomX] = false
    return mapa
}

this.genCene = async (x,y) => {
    let mapa = await this.genMapa(x,y)
    await this.spawnPlayer(mapa)
    await this.setGoal(mapa)
    return mapa
}

