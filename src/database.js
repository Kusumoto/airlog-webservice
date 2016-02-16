var mongo_uri = '';
var Mongoose = require('mongoose');  
Mongoose.connect(mongo_uri);  
var db = Mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));  
db.once('open', function callback() {  
    console.log("[%s] : Connection with database succeeded.", new Date());
});

exports.Mongoose = Mongoose;  
exports.db = db; 