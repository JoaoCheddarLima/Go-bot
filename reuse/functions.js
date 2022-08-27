const fs = require('fs')

this.insight = (name) => {
    let insights = JSON.parse(fs.readFileSync('./database/insights.json'))
    let actual = insights[name]
    if(actual === undefined){
        insights[name] = 1
        fs.writeFileSync('./database/insights.json', JSON.stringify(insights, null, 2))
    }else{
        insights[name] = insights[name] + 1
        fs.writeFileSync('./database/insights.json', JSON.stringify(insights, null, 2)) 
    }
}
this.finder = (a, b) => {
    for(let i = 0; i < b.length; i++){
        if(b[i] === a[0]){
            let newindex = i
            for(let x = 0; a.length; x++){
                if(a[x] === b[newindex]){
                    newindex++
                    if(x === a.length - 1){
                        return true
                    }
                    continue
                }
                return false
            }
        }
        continue
    }
}