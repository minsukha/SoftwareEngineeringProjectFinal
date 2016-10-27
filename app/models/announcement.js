var mongoose = require('mongoose');

var announcementSchema = mongoose.Schema({

    announcement         : {
        message     : String,
        name    	: String,
        date        : String
    }
});

module.exports = mongoose.model('Announcement', announcementSchema);