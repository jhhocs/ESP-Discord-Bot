const Discord = require("discord.js");
const itemModel = require('../../models/items');
const profileModel = require('../../models/profileSchema');

module.exports = {
    name: 'buy',
    aliases: [],
    category: "esp",
    permissions: [],
    description: "Buy an item from the shop",
    async execute(client, message, args, discord, profileData){
        if(args.length != 2 && args.length != 3)
            return message.channel.send("Please provide a valid input");
        
        let quantity = args[2];

        if(!quantity)
            quantity = 1;
        else if(quantity % 1 != 0)
            return message.channel.send("Please provide a valid number");

        const itemName = args[1].toLowerCase();
        const embed = new Discord.MessageEmbed()
            .setAuthor(`ESP Shop`, 'https://cdn.discordapp.com/attachments/537166499782328323/870818900336574474/ethan.jpg')
            .setColor("RANDOM");
        let itemData = await itemModel.findOne({ name: itemName, quantity: {$gt: 0} });
        if(!itemData){
            return message.channel.send(embed.setDescription("Please provide an item from the shop"));
        }
        else if(itemData.buyPrice >= profileData.points){
            return message.channel.send(embed.setDescription("You do not have enough points to buy this item"));
        }
        else if(quantity > itemData.quantity){
            if(itemData.quantity == 1)
            return message.channel.send(embed.setDescription(`There is only ${itemData.quantity} ${itemName} left in stock`));
            return message.channel.send(embed.setDescription(`There are only ${itemData.quantity} ${itemName}'s left in stock`));
        }
        else{
            await itemModel.findOneAndUpdate(
                {
                    name: itemName,
                },
                {
                    $inc: {
                        quantity: -quantity,
                    }
                }
            );
            
            for(i = 0; i < profileData.items.length; i++){
                if(profileData.items[i].name == itemName){
                    await profileModel.findOneAndUpdate(
                        {
                            userID: message.author.id,
                            items: { $elemMatch: {name: itemName}}
                        },
                        {
                            $inc: {
                                points: -(itemData.buyPrice * quantity)
                            },
                            $set: {
                                "items.$.quantity": (Number(profileData.items[i].quantity) + Number(quantity))
                            },
                        }
                    );
                    return message.channel.send(embed.addField(`You have purchased a(n) ${itemName}`, `You now have ${profileData.points - (itemData.buyPrice * quantity)} points`));
                }
            }
            await profileModel.updateOne(
                {
                    userID: message.author.id,
                },
                {
                    $inc: {
                        points: -(itemData.buyPrice * quantity),
                    },
                    $set: {
                        items: { name: itemName, quantity: quantity},
                    },
                }
            );
        }

        return message.channel.send(embed.addField(`You have purchased a(n) ${itemName}`, `You now have ${profileData.points - (itemData.buyPrice * quantity)} points`));
    }
}