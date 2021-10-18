const Discord = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "help",
    aliases: ["h"],
    category: "general",
    permissions: [],
    description: "Returns command list / Specific command info",
    async execute(client, message, args){
        // If there's an args found
        // Send the info of that command found
        // If no info found, return not found embed.
        if (args[0]) {
            return getCMD(client, message, args[0]);
        } else {
            // Otherwise send all the commands available
            // Without the cmd info
            return getAll(client, message);
        }
    }
}

function getAll(client, message) {
    const embed = new Discord.MessageEmbed()
        .setColor("RANDOM");

    // // for(const category of categores){
    // //     embed.addField(`**${this.client.utils.capitalise(category)}**`, this.client.commands.filter(cmd =>
    // //         cmd.category === category).map(cmd => `\`${cmd.name}\``).join(' '));
    // // }

    // // return message.channel.send(embed);
    const commands = (category) => {
        return client.commands
            .filter(cmd => cmd.category === category && (cmd.permissions == "" || !cmd.permissions))
            .map(cmd => cmd.name)
            .join("\n");
    }

    for(cat of client.categories){
        embed.addFields(
            {name: `${cat[0].toUpperCase() + cat.slice(1)} `, value: commands(cat), inline: true},
        )
    }
    return message.channel.send(embed.attachFiles(['./photos/ethan.jpg'])
                                     .setAuthor('Ethansmells Help', 'attachment://ethan.jpg')
                                     .setFooter('>help <command> for more info (>esp <command> to access ESP commands)'));
}

function getCMD(client, message, input) {
    const embed = new Discord.MessageEmbed()
        .attachFiles(['./photos/ethan.jpg'])
        .setAuthor('Ethansmells Help', 'attachment://ethan.jpg');

    // Get the cmd by the name or alias
    const cmd = client.commands.get(input) || client.commands.find(a => a.aliases && a.aliases.includes(input));
    let info = `No information found for command **${input.toLowerCase()}**`;

    // If no cmd is found, send not found embed
    if (!cmd || !message.member.permissions.has(cmd.permissions) && cmd.permissions) {
        return message.channel.send(embed.setColor("RED").setDescription(info));
    }

    // Add all cmd info to the embed
    if (cmd.name) info = `**Command name**: ${cmd.name}`;
    if (cmd.aliases == "" || !cmd.aliases) info += `\n**Aliases**: N/A`;
    else info += `\n**Aliases**: ${cmd.aliases.map(a => `\`${a}\``).join(", ")}`;
    if (cmd.description) info += `\n**Description**: ${cmd.description}`;
    if (cmd.permissions.length > 0) info += `\n**Permissions**: ${cmd.permissions}`;
    if (cmd.usage) {
        info += `\n**Usage**: ${cmd.usage}`;
    }

    return message.channel.send(embed.setColor("#3DED97").setDescription(info));
}