const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userID: { type: String, require: true, unique: true},
    userTag: { type: String, require: true, unique: true},
    serverID: { type: String, require: true},
    points: { type: Number, default: 10},
    items: { type: Array},
    dbTime: { type: Array},
    bank: { type: Number}
});

const model = mongoose.model('ProfileModels', profileSchema);

module.exports = model;