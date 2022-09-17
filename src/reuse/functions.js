const fs = require('fs')
let path = './src/database'
this.insight = (name, obj, objname) => {
    let insights = JSON.parse(fs.readFileSync(`${path}/insights.json`))
    if(obj === true){
    let actual = insights[objname]
        if(actual === undefined){
            insights[objname] = {
                [`${name}`]:1
            }
            fs.writeFileSync(`${path}/insights.json`, JSON.stringify(insights, null, 2))
            return
        }else{
            insights[objname][name] === undefined ? insights[objname][name] = 1 : insights[objname][name] += 1
            fs.writeFileSync(`${path}/insights.json`, JSON.stringify(insights, null, 2)) 
            return
        }
    }
    let actual = insights[name]
    if(actual === undefined){
        insights[name] = 1
        fs.writeFileSync(`${path}/insights.json`, JSON.stringify(insights, null, 2))
    }else{
        insights[name] = insights[name] + 1
        fs.writeFileSync(`${path}/insights.json`, JSON.stringify(insights, null, 2)) 
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
