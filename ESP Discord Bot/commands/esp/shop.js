const Discord = require("discord.js");
const shopModel = require('../../models/items');

module.exports = {
    name: 'shop',
    aliases: [],
    category: "esp",
    permissions: [],
    description: "Time to go broke",
    async execute(client, message, args, discord, profileData){
        let itemData;
        let pages = 1;
        const numbPerPage = 5;
        let currentPage = 1;
        const leftArrow = '⬅️';
        const rightArrow = '➡️';
        const x = '❌';

        const embed = new Discord.MessageEmbed()
            .setAuthor('ESP Shop', 'https://cdn.discordapp.com/attachments/537166499782328323/870818900336574474/ethan.jpg')
            .setColor("RANDOM");
        
        itemData = await shopModel.find( { quantity: { $gt: 0} } );
        pages = Math.floor(itemData.length/numbPerPage);
        if(itemData.length%numbPerPage != 0)
            pages += 1;

        if(itemData.length == 0)
            return message.channel.send(embed.addField("The shop is currently closed", "F"));

        update(numbPerPage, currentPage, embed, itemData, pages);

        let messageEmbed = await message.channel.send(embed);
        messageEmbed.react(leftArrow);
        messageEmbed.react(rightArrow);
        messageEmbed.react(x);

        client.on('messageReactionAdd', async (reaction, user) =>{
            if(reaction.message.partial) await reaction.message.fetch();
            if(reaction.partial) await reaction.fetch();
            if(user.bot) return;
            if(!reaction.message.guild) return;
            
            reaction.users.remove(user.id);
            
            if(user.id != message.author.id) return;
            console.log(user.id + "         " + message.author.id);
            if(reaction.emoji.name === x){
                message.delete();
                messageEmbed.delete();
                return;
            }
            else if(reaction.emoji.name === leftArrow){
                if(currentPage == 1) return;
                currentPage -= 1;
            }
            else if(reaction.emoji.name === rightArrow){
                if(currentPage == pages) return;
                currentPage += 1;
            }
            update(numbPerPage, currentPage, embed, itemData, pages);
            messageEmbed.edit({ embed: embed});
        });
    }
}

function update(numbPerPage, currentPage, embed, itemData, pages){
    embed.fields = [];
    for(i = 0; i < numbPerPage; i++){
        let currentIndex = i + numbPerPage * (currentPage - 1);
        if(currentIndex == itemData.length)
            break;
        embed
            .addField(`**${itemData[currentIndex].name}**`, `Price: ${itemData[currentIndex].buyPrice} \n Quantity: ${itemData[currentIndex].quantity}`)
            .setFooter(`Page ${currentPage} of ${pages}`);;
        
    }
}