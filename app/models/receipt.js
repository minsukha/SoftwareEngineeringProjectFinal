var mongoose = require('mongoose');

var receiptSchema = mongoose.Schema({

    receipt       : {
        date        : String,
        source	    : String,
        description		: String,
        amount	: String
    }
});

module.exports = mongoose.model('Receipt', receiptSchema);