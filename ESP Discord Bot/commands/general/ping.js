module.exports = {
    name: 'ping',
    aliases: [],
    category: "general",
    permissions: [],
    description: "pong",
    execute(client, message, args){
        message.channel.send('pong');
    }
}