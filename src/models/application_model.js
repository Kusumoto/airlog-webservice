var Mongoose = require('../database').Mongoose;

var applicationSchema = new Mongoose.Schema({
    application_name : String,
    application_token : String,
    application_lang : String,
    application_agent : String
}, { collection: 'app' } );

exports.App = Mongoose.model('app',applicationSchema);
