var mongoose = require("mongoose");

//Create the schema
var comment_schema = mongoose.Schema({
    text: String,
    createdAt: { type: Date, default: Date.now },
    author: {

        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }

});

//Create the model

module.exports = mongoose.model("Comment", comment_schema);
