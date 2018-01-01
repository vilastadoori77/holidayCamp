var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userschema = new mongoose.Schema({
    name: String,
    password: String,

});

userschema.plugin(passportLocalMongoose);
//CREATE AN MODEL ON MONGOOSE for User
module.exports = mongoose.model("User", userschema);
