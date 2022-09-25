const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Emoji } = require('discord.js');

this.button = (obj) => {
    const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId(obj.id)
            .setLabel(obj.text)
            .setStyle(ButtonStyle.Success)
    );
    return row
}

this.buttons = (obj, n = 1) => {
    const row = new ActionRowBuilder()
    let i = 0
    while(i < n){
        row.addComponents(
            new ButtonBuilder()
                .setCustomId(obj.id[i])
                .setLabel(obj.text[i])
                .setStyle(ButtonStyle.Success)
        );
        i++
    }
    return row
}

this.buttonURL = (obj) => {
    const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setLabel(obj.text)
            .setStyle(ButtonStyle.Link)
            .setURL(obj.url)
    );
    return row
}

this.idBuilder = (digits) => {
    let id = ''
    const nums = [1,2,3,4,5,6,7,8,9]
    const letters = ['a','b','c','d','e','f','g']
    const special = ['!','@','#','$',"%","&","*", "(",")"]
    for(let i = digits; i > 0; i--){
        id += nums[Math.floor(Math.random() * nums.length)]
        id += letters[Math.floor(Math.random() * letters.length)]
        id += special[Math.floor(Math.random() * special.length)]
    }
    return id
}