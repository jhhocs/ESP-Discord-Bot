module.exports = {
    name: 'lifeadvice',
    aliases: [],
    category: "fun",
    permissions: [],
    description: "the best no money can buy",
    execute(client, message, args){
        let advice = ['Take time to know yourself.',
                    'A narrow focus brings big results.',
                    'Show up fully.',
                    'Don\'t make assumptions.',
                    'Be patient and persistent.',
                    'In order to get, you have to give.',
                    'Luck comes from hard work.',
                    'Be your best at all times.',
                    'Don\'t try to impress everyone.',
                    'sucks to suck lmao hahahhahahahaha',
                    'just eat Cookie'
    ];

        message.channel.send(advice[Math.floor(Math.random() * advice.length)]);

    }
}