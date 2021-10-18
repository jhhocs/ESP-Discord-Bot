module.exports = {
    name: 'why',
    aliases: [],
    category: "fun",
    permissions: [],
    description: "A simple question with a simple answer",
    execute(client, message, args){
        message.channel.send('why not');
    }
}