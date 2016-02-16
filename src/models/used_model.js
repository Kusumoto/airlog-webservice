var Mongoose = require('../database').Mongoose;

var usedSchema = new Mongoose.Schema({
   use_date : String,
   use_time : String,
   use_datetime : { type: Date, default: Date.now },
   use_ipaddr : String,
   use_appid : String,
   use_appname : String,
   use_funcid : String,
   use_funcname : String
}, { collection: 'used' });

exports.Used = Mongoose.model('used',usedSchema);