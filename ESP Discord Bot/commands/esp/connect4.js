const Discord = require("discord.js");

const numbers = [`1️⃣`,`2️⃣`,`3️⃣`,`4️⃣`,`5️⃣`,`6️⃣`,`7️⃣`];

let displayedBoard = ["🔵🔵🔵🔵🔵🔵🔵", "🔵🔵🔵🔵🔵🔵🔵", "🔵🔵🔵🔵🔵🔵🔵", "🔵🔵🔵🔵🔵🔵🔵", "🔵🔵🔵🔵🔵🔵🔵", "🔵🔵🔵🔵🔵🔵🔵", "1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣"]

let colIndex = [5, 5, 5, 5, 5, 5, 5];
let board = new Array(7);

for(let i = 0; i < board.length; i++) {
    board[i] = new Array(6);
}

for(let i = 0; i < board.length; i++) {
    for(let j = 0; j < board[i].length; j++) {
        board[i][j] = 0;
    }
}

let players, playerTurn;

let winner = 0;

const pieces = [`🔴`, `🟡`];
const accept = `✅`;

module.exports = {
    name: 'connect4',
    aliases: [],
    category: "esp",
    permissions: ["DEV"],
    description: "Checks ESP balance",
    async execute(client, message, args){

        players = [message.author, ``];

        const embed = new Discord.MessageEmbed()
            .setAuthor(`ESP Connect 4`, 'https://cdn.discordapp.com/attachments/537166499782328323/870818900336574474/ethan.jpg')
            .setColor("RANDOM")
            .addField("Waiting for another player to accept game ...", "\u200b", false);

        embed.addField(displayedBoard, "\u200b", false);

        let messageEmbed = await message.channel.send(embed);
        messageEmbed.react(numbers[0]);
        messageEmbed.react(numbers[1]);
        messageEmbed.react(numbers[2]);
        messageEmbed.react(numbers[3]);
        messageEmbed.react(numbers[4]);
        messageEmbed.react(numbers[5]);
        messageEmbed.react(numbers[6]);
        messageEmbed.react(accept);

        playerTurn = Math.floor(Math.random() * 2  + 1);

        client.on('messageReactionAdd', async (reaction, user) =>{
            if(reaction.message.partial) await reaction.message.fetch();
            if(reaction.partial) await reaction.fetch();
            if(user.bot) return;
            if(!reaction.message.guild) return;
            
            reaction.users.remove(user.id);

            if(players[1] != `` && players[playerTurn - 1] != user) {
                return;
            }
            
            switch(reaction.emoji.name) {
                case(accept):
                    players[1] = user;
                    console.log(`${players[0].tag} vs ${players[1].tag}`);
                    reaction.remove();
                    updateTurnUI(embed, messageEmbed);
                    break;
                case(numbers[0]):
                    if(addPiece(0, playerTurn)) {
                        switchTurns(embed, messageEmbed);
                    }
                    break;
                case(numbers[1]):
                    if(addPiece(1, playerTurn)) {
                        switchTurns(embed, messageEmbed);
                    }
                    break;
                case(numbers[2]):
                    if(addPiece(2, playerTurn)) {
                        switchTurns(embed, messageEmbed);
                    }

                    break;
                case(numbers[3]):
                    if(addPiece(3, playerTurn)) {
                        switchTurns(embed, messageEmbed);
                    }
                    break;
                case(numbers[4]):
                    if(addPiece(4, playerTurn)) {
                        switchTurns(embed, messageEmbed);
                    }
                    break;
                case(numbers[5]):
                    if(addPiece(5, playerTurn)) {
                        switchTurns(embed, messageEmbed);
                    }
                    break;
                case(numbers[6]):
                    if(addPiece(6, playerTurn)) {
                        switchTurns(embed, messageEmbed);
                    }
                    break;
                default:
                    console.log("???");
            }
        });

        if(winner != 0) {
            embed.fields[0] = {name : `${players[winner-1].tag} wins!`, value : "\u200b", inline: false}; 
            messageEmbed.edit(embed);
            message.reactions.removeAll();
        }
    }
}

function addPiece(col, player) {
    if(colIndex[col] == -1) {
        return false;
    }
    board[col][colIndex[col]] = player;
    updateDisplayBoard(col, colIndex[col], player);
    checkWin(col, colIndex[col]);
    colIndex[col]--;
    return true;
}

function updateDisplayBoard(col, row, player) {
    displayedBoard[row] = displayedBoard[row].substring(0, col*2) + pieces[player - 1] + displayedBoard[row].substring(col*2 + 2);
    console.log(`Col: ${col}, Row: ${row}, Player: ${player}`);
    console.log(board);
    console.log(displayedBoard);
}

function switchTurns(embed, messageEmbed) {
    if(playerTurn === 1) {
        playerTurn = 2;
        updateEmbed(embed, messageEmbed);
        return;
    }
    playerTurn = 1;
    updateEmbed(embed, messageEmbed);
}

function updateEmbed(embed, messageEmbed) {
    embed.fields[0] = {name : `${players[playerTurn-1].tag}'s turn ${pieces[playerTurn - 1]}`, value : "\u200b", inline: false}; 
    embed.fields[1] = {name: displayedBoard, value: "\u200b", inline: false};
    messageEmbed.edit(embed);
}

function checkWin(col, row) {
    let counter = 0;
    //Check Vertical
    while(counter != 4) {

    }
    //Check Horizontal

    //Check Top Left Bot Right

    //Check Top Right Bot Left

    if(counter == 4) {
        winner = playerTurn;
    }
}