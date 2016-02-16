var Mongoose = require('../database').Mongoose;

var functionSchema = new Mongoose.Schema({
    function_name : String,
    function_token : String,
    application_id : String,
    application_name : String,
    function_primary : String
}, { collection: 'func' });

exports.Func = Mongoose.model('func',functionSchema);