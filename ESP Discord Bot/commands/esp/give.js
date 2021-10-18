const profileModel = require('../../models/profileSchema');

module.exports = {
    name: 'give',
    aliases: [],
    category: "esp",
    permissions: ["Owner"],
    description: "Add points",
    async execute(client, message, args){
        
        if(message.author.id != process.env.AUTHOR_ID) return;
      
        
        if(args.length != 3)
            return message.channel.send("Please provide a valid input")
        const amount = args[2];
        const target = message.mentions.users.first();
        if(amount % 1 != 0){
            return message.channel.send("Please provide a valid number");
        }
        if(!target)
            return message.channel.send("That user does not exist");
        try{
            const targetData = await profileModel.findOne({ userID: target.id });
            if(!targetData)
                return message.channel.send("That user is not enrolled in ESP");
            
            await profileModel.findOneAndUpdate(
                {
                    userID: target.id,
                },
                {
                    $inc: {
                        points: amount,
                    },
                }
            );
            return message.channel.send(`${message.mentions.users.first()} has been given ${amount} points!`);
        }catch(err){
            console.log(err);
        }
    }
}