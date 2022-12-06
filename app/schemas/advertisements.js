const { suppressDeprecationWarnings } = require('moment');
const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({ 
    name: String, 
    status: String,
    slug: String,
    link: String,
    ordering: Number,
    avatar: String,
    group: {
        id: String,
        name: String,
        slug: String,
        link: String,
    },
    created: {
        user_id: String,
        user_name: String,
        time: Date
    },
    modified: {
        user_id: String,
        user_name: String,
        time: Date
    },
});

module.exports = mongoose.model(databaseConfig.col_advertisements, schema );