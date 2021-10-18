const Discord = require("discord.js");
const itemModel = require('../../models/items');

module.exports = {
    name: 'additem',
    aliases: [],
    category: "esp",
    permissions: ["ADMINISTRATOR"],
    description: "",
    async execute(client, message, args){

        if(message.author.id != process.env.AUTHOR_ID) return;


        let itemData;
        const desc = args.join(" ");
        let info = desc.split(" | ");
        if(info.length != 7)
            return message.channel.send(`Please use this format:\n \`\`>esp additem | name | description | type | quantity | sell price | buy price | rarity\`\``);
        try{
            const embed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .attachFiles(['./photos/ethan.jpg'])
                .setAuthor('Ethansmells Points', 'attachment://ethan.jpg');
                itemData = await itemModel.findOne({ name: info[1]});
            if(!itemData){
                let profile = await itemModel.create({
                    name: info[1],
                    description: info[2],
                    type: info[3],
                    quantity: info[4],
                    sellPrice: info[5],
                    buyPrice: info[6],
                    rarity: info[7],
                });
                profile.save();
                console.log(`${desc} has been added`);
                return message.channel.send(embed.setDescription(`This item has been created`));
            }
            return message.channel.send(embed.setDescription(`This item already exists`));
        } catch (err) {
            console.log(err);
        }
    }
}