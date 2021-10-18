const { TeamMember } = require("discord.js");
require('dotenv').config();
module.exports = {
    name: 'clear',
    aliases: [],
    category: "general",
    permissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
    description: "Clears messages",
    async execute(client, message, args){
        //message.author.id == process.env.AUTHOR_ID
        if(message.member.permissions.has("MANAGE_MESSAGES") || message.member.permissions.has("ADMINISTRATOR")){
            if(!args[0])        return message.reply("please provide a valid number");
            if(isNaN(args[0]))  return message.reply("please provide a valid number");
            
            if(args[0] > 100)   return message.reply("please provide a number from 1 to 100");
            if(args[0] < 1)     return message.reply("please provide a number from 1 to 100");
            
            await message.channel.messages.fetch({limit: args[0]}).then(messages =>{
                message.channel.bulkDelete(messages);
            });
        }
        else{
            message.channel.send('You don\'t have permission to use this command');
        }
    }
}