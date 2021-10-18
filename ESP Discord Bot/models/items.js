const mongoose = require('mongoose');

const items = new mongoose.Schema({
    name: { type: String, require: true, unique: true},
    description: { type: String},
    type:{ type: String},
    quantity: { type: Number},
    sellPrice: {type: Number},
    buyPrice: { type: Number},
    rarity: { type: String},
});

const model = mongoose.model('items', items);

module.exports = model;