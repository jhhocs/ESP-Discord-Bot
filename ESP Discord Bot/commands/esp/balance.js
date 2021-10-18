const Discord = require("discord.js");
module.exports = {
    name: 'balance',
    aliases: ["bal"],
    category: "esp",
    permissions: [],
    description: "Checks ESP balance",
    execute(client, message, args, discord, profileData){
        const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .attachFiles(['./photos/ethan.jpg'])
            .setAuthor('Ethansmells Points', 'attachment://ethan.jpg')
            .setDescription(`**\`\`${message.author.tag}\`\`** \n Points: ${profileData.points.toLocaleString()}`);
        return message.channel.send(embed);
    }
}