const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({ 
    name: String,
    email: String,
    phone: String,
    message: String,
    subject: String,
    status: String,
    created: {
        time: Date
    },
});

module.exports = mongoose.model(databaseConfig.col_contact, schema );