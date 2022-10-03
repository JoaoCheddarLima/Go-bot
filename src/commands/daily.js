const { checkUser } = require('../reuse/config/data');
const { insight} = require('../reuse/functions');

module.exports = {
    name:'daily',
    async execute(message,args, client, input1, input2, userId){
        //
        checkUser(message.author.id)
        insight('Daily')
        //
        const captcha = require('../games/captcha.js')
        await captcha(message,client,'daily', {x:5, y:5})
    }
}
