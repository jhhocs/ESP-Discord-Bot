const Discord = require("discord.js");
const profileModel = require('../../models/profileSchema');

module.exports = {
    name: 'raffle',
    aliases: [""],
    category: "esp",
    permissions: [],
    description: "Buy a 10, 20, 50, or 100 point raffle ticket.",
    async execute(client, message, args, discord, profileData){
        if(args.length != 2){
            return message.channel.send("Please provide a valid input")
        }
        const amount = args[1];

        if(amount % 1 != 0 || amount <= 0){
            return message.channel.send("Please provide a valid number");
        }
        else if(amount > profileData.points){
            return message.channel.send("You don't have enough points");
        }
        let reward;
        if(amount == 10){
            let pool = [0, 0, 1, 10, 10, 10, 50];
            reward = pool[Math.floor(Math.random() * pool.length)];
        }
        else if(amount == 20){
            let pool = [0, 0, 10, 10, 10, 10, 20, 20, 100];
            reward = pool[Math.floor(Math.random() * pool.length)];
        }
        else if(amount == 50){
            let pool = [0, 0, 10, 20, 20, 20, 20, 50, 50, 100, 150, 450];
            reward = pool[Math.floor(Math.random() * pool.length)];
        }
        else if(amount == 100){
            let pool = [0, 20, 20, 20, 50, 50, 50, 50, 100, 100, 100, 200, 200, 1000];
            reward = pool[Math.floor(Math.random() * pool.length)];
        }
        else if(amount == 1000){
            let pool = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100000];
            reward = pool[Math.floor(Math.random() * pool.length)];
        }
        else if(amount == 1000000){
            let pool = [0, 1000000000];
            reward = pool[Math.floor(Math.random() * pool.length)];
        }
        else if(amount == 1000000000){
            let pool = [-1000000000000, 1000000000000];
            reward = pool[Math.floor(Math.random() * pool.length)];
        }
        else{
            return message.channel.send("Please buy a 10, 20, 50, 100, or 1000 point raffle ticket")
        }
        const netGain = reward - amount;
        await profileModel.findOneAndUpdate(
            {
                userID: message.author.id,
            },
            {
                $inc: {
                    points: netGain,
                },
            }
        );
        const loading = {
            color: 0x0099ff,
            author: {
                name: 'ESP Raffle',
                icon_url: 'https://cdn.discordapp.com/attachments/537166499782328323/870818900336574474/ethan.jpg',
            },
            description: 'Some description here',
            image: {
                url: 'https://media.giphy.com/media/xTk9ZvMnbIiIew7IpW/giphy.gif',
            },
            timestamp: new Date(),
        };

        const update = {
            color: 0x0099ff,
            author: {
                name: 'ESP Raffle',
                icon_url: 'https://cdn.discordapp.com/attachments/537166499782328323/870818900336574474/ethan.jpg',
            },
            description: `\`\`${profileData.userTag}\`\` You won ${reward} points`,
            timestamp: new Date(),
        };
        
        message.channel.send({ embed: loading })
        .then((msg)=> {
            setTimeout(function(){
                msg.edit({ embed: update});
            }, (1000 + Math.floor(Math.random() * 1000)))
        }); 
    }
}