
const ds = require("discord.js");
require('dotenv').config();
const profileModel = require("../../models/profileSchema");

module.exports = async (Discord, client, message) => {
    const prefix = process.env.PREFIX;
    if(!message.content.startsWith(prefix) || message.author.bot)
        return;
    const args = message.content.slice(prefix.length).split(/ +/);

    let cmd = args.shift().toLowerCase();
    
    let profileData;

    let esp = false;
    if(cmd == "esp" && args[0] == "register"){
        cmd = args[0].toLowerCase();
        esp = true;
    }
    else if(cmd == "esp" && args[0]){
        cmd = args[0].toLowerCase();
        try{
            profileData = await profileModel.findOne({ userID: message.author.id });
            if(!profileData){
                const embed = new ds.MessageEmbed()
                    .setColor("RANDOM")
                    .attachFiles(['./photos/ethan.jpg'])
                    .setAuthor('Ethansmells Help', 'attachment://ethan.jpg')
                    .setDescription("You are currently not enrolled in the esp system")
                    .setFooter(`>esp register to enroll in the ESP system`);
                return message.channel.send(embed);
            }
            else if(profileData.userTag != message.author.tag){
                await profileModel.findOneAndUpdate(
                    {
                        userID: message.author.id,
                    },
                    {
                        $set: {
                            userTag: message.author.tag,
                        },
                    }
                );
            }
            esp = true;
        }
        catch(err){
            console.log(err);
        }
    }
    const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));
    if(!command) return;
    if(command && (command.category == "esp" && !esp) || (command.category != "esp" && esp)) return;
    if(command) command.execute(client, message, args, Discord, profileData);
}