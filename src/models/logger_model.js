var Mongoose = require('../database').Mongoose;

var loggerSchema = new Mongoose.Schema({
   log_type : String,
   log_data : String,
   log_date : String,
   log_time : String,
   log_datetime : { type: Date, default: Date.now },
   log_ip : String,
   log_vagent : String,
   log_appname : String,
   log_appid : String,
   log_funcname : String,
   log_funcid : String,
   log_classname : String,
   log_methodname : String 
}, { collection: 'logger' });

exports.Logger = Mongoose.model('logger',loggerSchema);