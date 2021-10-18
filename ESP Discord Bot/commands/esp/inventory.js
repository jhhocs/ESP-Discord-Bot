const Discord = require("discord.js");

module.exports = {
    name: 'inventory',
    aliases: [],
    category: "esp",
    permissions: ["WORK IN PROGRESS"],
    description: "Check your inventory",
    async execute(client, message, args, discord, profileData){
        const embed = new Discord.MessageEmbed()
            .setAuthor(`${message.author.tag}'s Inventory`, 'https://cdn.discordapp.com/attachments/537166499782328323/870818900336574474/ethan.jpg')
            .setColor("RANDOM");
        if(profileData.items.length > 0){
            for(i = 0; i < profileData.items.length; i++){
                embed.addField(`${profileData.items[i].name}`, `Quantity: ${profileData.items[i].quantity}`);            
            }
        }
        else{
            embed.setDescription("You have nothing to your name :(");
        }
        return message.channel.send(embed);
    }
}