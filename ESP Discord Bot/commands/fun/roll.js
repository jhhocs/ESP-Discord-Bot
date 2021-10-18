module.exports = {
    name: 'roll',
    aliases: [],
    category: "fun",
    permissions: [],
    description: "simple dice command",
    execute(client, message, args){
        if(args.length != 2 || isNaN(args[0]) || isNaN(args[1])){
            message.channel.send('Please provide a valid input | ie: [!roll 1 10]');
        }
        else{
            const start = args[0];
            const range = args[1] - start + 1;
            message.channel.send(Math.floor((parseInt(start) + Math.random() * range)));
        }
    }
}