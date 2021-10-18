const Discord = require("discord.js");
const itemModel = require('../../models/items');
const profileModel = require('../../models/profileSchema');

module.exports = {
    name: 'dungeon',
    aliases: [],
    category: "esp",
    permissions: ["WORK IN PROGRESS"],
    description: "Start an auto dungeon",
    async execute(client, message, args, discord, profileData){
        if(args.length != 2)
            return message.channel.send("Please provide a valid input ie: >esp dungeon 1");
        
        let room = args[1];

        if(room % 1 != 0 && room == 1)
            return message.channel.send("Please provide a valid room");

        const embed = new Discord.MessageEmbed()
            .setAuthor(`Dungeon ${room}`, 'https://cdn.discordapp.com/attachments/537166499782328323/870818900336574474/ethan.jpg')
            .setColor("RANDOM");
        
            dungeonRun(embed, room, message);
    }
}

function dungeonRun(embed, room, message){
    let userHealth = 20;
    let enemyHealth = 40;

    let userDamage = [1, 4];
    let enemyDamage = [0, 2];

    embed.setThumbnail("https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/299b4545-0806-4ae6-85ad-e50a8b3728fc/d8sf2rq-6140d6df-a5f1-434f-b2be-d12b14082fbe.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI5OWI0NTQ1LTA4MDYtNGFlNi04NWFkLWU1MGE4YjM3MjhmY1wvZDhzZjJycS02MTQwZDZkZi1hNWYxLTQzNGYtYjJiZS1kMTJiMTQwODJmYmUucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.yDSODLbrH1lol89dxfoZu7FC698MFEmx5GwS8EomeSc")
        .addField(`${message.author.tag}`, `Health: ${userHealth}/20`)
        .addField(`Rock`, `Health: ${enemyHealth}/40`);
    
        message.channel.send({ embed: embed })
        .then((msg)=> {
                
                let interval = setInterval(function(){
                    let coin = Math.floor(Math.random() * 2) + 1;
                    if(coin == 1)
                        enemyHealth -= Math.floor(Math.random() * userDamage[1]) + userDamage[0] + 1;
                    else if(coin == 2)
                        userHealth -= Math.floor(Math.random() * enemyDamage[1]) + enemyDamage[0] + 1;
                    
                    embed.fields = [];
                    embed.addField(`${message.author.tag}`, `Health: ${userHealth}/20`)
                        .addField(`Rock`, `Health: ${enemyHealth}/40`);
                    msg.edit({ embed: embed});


                    if(userHealth <= 0){
                        embed.setDescription("You lose D:");
                        msg.edit({ embed: embed});
                        clearInterval(interval);
                    }
                    else if(enemyHealth <= 0){
                        embed.setDescription("You win!");
                        msg.edit({ embed: embed});
                        clearInterval(interval);
                    }

                }, (1500 + Math.floor(Math.random() * 1000)));
        }); 
}