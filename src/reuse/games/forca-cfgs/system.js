this.getRandom = (questions) => {
    let palavras_array = []
    let nome_temas = []

    for(key in questions){
        palavras_array.push(questions[key])
        nome_temas.push(key)
    }

    let randomTema = Math.floor(Math.random() * palavras_array.length)
    let temaArray = palavras_array[randomTema]
    let tema = nome_temas[randomTema]
    let palavra = Math.floor(Math.random() * temaArray.length)

    return {
        palavra:temaArray[palavra], 
        tema:tema
    }
    
}