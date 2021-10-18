const suits = {
    'spades': '♠',
    'diamonds': '♦',
    'clubs': '♣',
    'hearts': '♥'
};
const values = {
    'A': 11,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    'J': 10,
    'Q': 10,
    'K': 10
};

let stand = false;

const hidden = ['\`\`\`┌─────────┐', '│░░░░░░░░░│', '│░░░░░░░░░│', '│░░░░░░░░░│', '│░░░░░░░░░│', '│░░░░░░░░░│', '└─────────┘\`\`\`'];

const Discord = require("discord.js");
const message = require("../../events/guild/message");
const profileModel = require('../../models/profileSchema');

module.exports = {
    name: 'blackjack',
    aliases: [],
    category: "esp",
    permissions: [],
    description: "Blackjack",
    async execute(client, message, args){

        let dealerCards = [];
        let playerCards = [];
        
        const deck = getDeck();
        shuffle(deck);
        const embed = new Discord.MessageEmbed()
            .setAuthor(`ESP Blackjack`, 'https://cdn.discordapp.com/attachments/537166499782328323/870818900336574474/ethan.jpg')
            .setColor("RANDOM")
            .addField("DEALER CARDS", "\u200b", true)
            .addField("\u200b", "\u200b", true)
            .addField("\u200b", "\u200b")
            .addField("PLAYER CARDS", "\u200b", true)
            .addField("\u200b", "\u200b", true);

        let messageEmbed = await message.channel.send(embed);
        
        stand = false;

        const result = await newRound(deck, dealerCards, playerCards, embed, messageEmbed);

        if(countPlayerCards(playerCards) == 21){
            stand = true;
        }

        while(!stand){
            const asdf = await awaitUserInput(embed, messageEmbed, message);     
            if(!stand){
                hit(deck, playerCards, embed, messageEmbed);
                await new Promise(resolve => {
                    setTimeout(() => {
                        messageEmbed.edit(embed);
                        resolve("resolved");
                    }, 1000);
                });
                if(countPlayerCards(playerCards) > 21){
                    stand = true;
                    embed.setDescription("Busted");
                    embed.fields[1] = {name : "\u200b", value : visualizeCard(dealerCards[1]), inline: true};
                    messageEmbed.edit(embed);
                    return;
                }
                else if(countPlayerCards(playerCards) == 21){
                    stand = true
                }
            }
        }
        messageEmbed.edit(embed);

        await new Promise(resolve => {
            setTimeout(() => {
                embed.setDescription(". . ."); 
                embed.fields[1] = {name : "\u200b", value : visualizeCard(dealerCards[1]), inline: true}; 
                messageEmbed.edit(embed);
                resolve("resolved")
            }, 1000);
        });

        await new Promise(resolve => {
            setTimeout(() => {
                resolve("resolved")
            }, 750);
        });

        if(countDealerCards(dealerCards) < 17){
            await dealerDraw(deck, dealerCards, playerCards, embed, messageEmbed);
        }
        if(countDealerCards(dealerCards) > 21){
            embed.setDescription("You Win!");
        }
        else if(countPlayerCards(playerCards) > countDealerCards(dealerCards)){
            embed.setDescription("You Win!");
        }
        else if(countPlayerCards(playerCards) < countDealerCards(dealerCards)){
            embed.setDescription("You Lose");
        }
        else{
            embed.setDescription("Push");
        }
        messageEmbed.edit(embed);
    }
    
}

function getDeck(){
	var deck = new Array();

	for(const suit in suits){
		for(const value in values){
			var card = {Value: value, Suit: suit};
			deck.push(card);
		}
	}
	return deck;
}

function shuffle(deck){
	for (var i = 0; i < 1000; i++)
	{
		var location1 = Math.floor((Math.random() * deck.length));
		var location2 = Math.floor((Math.random() * deck.length));
		var tmp = deck[location1];

		deck[location1] = deck[location2];
		deck[location2] = tmp;
	}
}

function drawCard(deck){
    return deck.pop();
}

function visualizeCard(card){

    let space = ' ';
    const value = card.Value;
    const suitSymbol = suits[card.Suit];

    if(value == 10){
        space = '';
    }

    let shown = ['\`\`\`┌─────────┐', `│${value}${space}       │`, '│         │', `│    ${suitSymbol}    │`, '│         │', `│       ${space}${value}│`, '└─────────┘\`\`\`'];
    return shown.join('\n');
}

function newRound(deck, dealerCards, playerCards, embed, messageEmbed){
    let cardNum = 0;
    return new Promise(resolve => {
        let interval = setInterval(() => {

            const card = drawCard(deck);

            if(cardNum == 0){
                playerCards.push(card);
                embed.fields[3] = {name : "PLAYER CARDS", value : visualizeCard(card), inline: true};
            }
            else if(cardNum == 1){
                dealerCards.push(card);
                embed.fields[0] = {name : "DEALER CARDS", value : visualizeCard(card), inline: true};
            }
            else if(cardNum == 2){
                playerCards.push(card);
                embed.fields[4] = {name : "\u200b", value : visualizeCard(card), inline: true};
            }
            else{
                let newCard = {Value: card.Value, Suit: card.Suit, Hidden: true}
                dealerCards.push(newCard);
                embed.fields[1] = {name : "\u200b", value : hidden, inline: true};
            }
            messageEmbed.edit(embed);

            if(cardNum == 3){
                resolve("resolved");
                clearInterval(interval);
            }
            cardNum += 1;

        }, (1000));
    });
}

function awaitUserInput(embed, messageEmbed, message){
    return new Promise(resolve => {
        embed.setDescription("You have 15 seconds to make your decision");
        let decision;

        let filter = m => {
            decision = m.content.toLowerCase();
            return message.author.id === m.author.id && m.content.toLowerCase() === "hit" || m.content.toLowerCase() == "stand";
        };
        messageEmbed.edit(embed).then( () => {
            const msg =  message.channel.awaitMessages(filter, {max: 1, time: 15000, errors: ['time'] })
            .then(collected => {
                embed.setDescription(decision);
                resolve(decision);
                if(decision == "stand"){
                    stand = true;
                }
            })
            .catch(collected => {
                embed.setDescription("stand");
                resolve("stand");
                stand = true;
            });
        });
        
    });
}

function hit(deck, playerCards, embed, messageEmbed){
    const card = drawCard(deck);
    playerCards.push(card);
    embed.addField("\u200b", visualizeCard(card), true);
    messageEmbed.edit(embed);
}

function countPlayerCards(playerCards){
    let totalValue = 0;
    let totalA = 0;
    for(i = 0; i < playerCards.length; i++){
        let cardValue = playerCards[i].Value;
        if(cardValue == 'A'){
            cardValue = 11;
            totalA++;
        }
        else if(cardValue % 1 != 0){
            cardValue = 10;
        }
        totalValue += parseInt(cardValue);
    }
    if(totalValue == 21)
        return 21;
    else if(totalValue > 21 && totalA > 0){
        while(totalValue > 21 && totalA > 0){
            if(totalA > 0){
                totalValue -= 10;
                totalA --;
            }
        }
    }
    return totalValue;

}

function dealerDraw(deck, dealerCards, playerCards, embed, messageEmbed){
    return new Promise(resolve => {
        let interval = setInterval(() => {
            const card = drawCard(deck);
            dealerCards.push(card);
            embed.fields = [];
            embed.addField("DEALER CARDS", visualizeCard(dealerCards[0]), true);
            for(i = 1; i < dealerCards.length; i++){
                embed.addField("\u200b", visualizeCard(dealerCards[i]), true);
            }
            embed.addField("\u200b", "\u200b");
            embed.addField("PLAYER CARDS", visualizeCard(playerCards[0]), true);
            for(i = 1; i < playerCards.length; i++){
                embed.addField("\u200b", visualizeCard(playerCards[i]), true);
            }
            messageEmbed.edit(embed);
            if(countDealerCards(dealerCards) >= 17){
                resolve("resolved");
                clearInterval(interval);
            }
        }, 1000);
    });
}

function countDealerCards(dealerCards){
    let totalValue = 0;
    let totalA = 0;
    for(i = 0; i < dealerCards.length; i++){
        let cardValue = dealerCards[i].Value;
        if(cardValue == 'A'){
            cardValue = 11;
            totalA++;
        }
        else if(cardValue % 1 != 0){
            cardValue = 10;
        }
        totalValue += parseInt(cardValue);
    }
    if(totalValue == 21)
        return 21;
    else if(totalValue > 21 && totalA > 0){
        while(totalValue > 21 && totalA > 0){
            if(totalA > 0){
                totalValue -= 10;
                totalA --;
            }
        }
    }
    return totalValue;

}