const Discord = require("discord.js");
const profileModel = require('../../models/profileSchema');

module.exports = {
    name: 'leaderboard',
    aliases: [],
    category: "esp",
    permissions: [],
    description: "ESP leaderboard",
    async execute(client, message, args){
        let data = await profileModel.find().sort([['points', 'descending']]);

        const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setTitle("LEADERBOARD");
        for(i = 0; i < data.length; i++){
            embed.addField(`${i + 1}. \`\`${data[i].userTag}\`\``, `${data[i].points.toLocaleString()}`);
            
        }
        return message.channel.send(embed);
    }
}