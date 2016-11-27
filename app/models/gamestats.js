var mongoose = require('mongoose');

var gameStatsSchema = mongoose.Schema({

    gameStats       : {
        date        : String,
        opponent    : String,
        result		: String,
        fullStats	: String
    }
});

module.exports = mongoose.model('GameStats', gameStatsSchema);