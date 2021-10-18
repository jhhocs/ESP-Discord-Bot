const Discord = require("discord.js");
const profileModel = require('../../models/profileSchema');

module.exports = {
    name: 'register',
    aliases: [],
    category: "esp",
    permissions: [],
    description: "register for ethan smells points",
    async execute(client, message, args){
        if(!(args == "register")){
            return;
        }

        let profileData;
        try{
            const embed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .attachFiles(['./photos/ethan.jpg'])
                .setAuthor('Ethansmells Points', 'attachment://ethan.jpg');
            profileData = await profileModel.findOne({ userID: message.author.id});
            if(!profileData){
                let profile = await profileModel.create({
                    userID: message.author.id,
                    serverID: message.guild.id,
                    userTag: message.author.tag,
                    points: 10,
                    bank: 0 
                });
                profile.save();
                return message.channel.send(embed.setDescription(`**\`\`${message.author.tag}\`\`** has been registered`));
            }
            return message.channel.send(embed.setDescription(`profile **\`\`${message.author.tag}\`\`** already exists`));
        } catch (err) {
            console.log(err);
        }
    }
}