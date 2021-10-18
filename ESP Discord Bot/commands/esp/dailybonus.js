const Discord = require("discord.js");
const profileModel = require('../../models/profileSchema');

module.exports = {
    name: 'dailybonus',
    aliases: [],
    category: "esp",
    permissions: [],
    description: "free money",
    async execute(client, message, args, discord, profileData){
        let d = new Date();
        let reward = [20, 50, 50, 50, 100];

        const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .attachFiles(['./photos/ethan.jpg'])
            .setAuthor('Daily Bonus', 'attachment://ethan.jpg');

        if(profileData.dbTime.length != 2 || (d.getTime() - profileData.dbTime[0] > 86400000) || d.getDate() != profileData.dbTime[1]){
            const random = Math.floor(Math.random() * reward.length);
            await profileModel.findOneAndUpdate(
                {
                    userID: message.author.id,
                },
                {
                    $set: {
                        dbTime: [d.getTime(), d.getDate()],
                    },
                    $inc: {
                        points: reward[random],
                    }
                }
            );
            embed.setDescription(`${message.author.tag}, You have been awarded ${reward[random]} points. You now have ${profileData.points + reward[random]} points.`);
        }
        else{
            embed.setDescription(`\`\`${message.author.tag}\`\`, You have already claimed your daily bonus`)
        }
        return message.channel.send(embed);
    }
}