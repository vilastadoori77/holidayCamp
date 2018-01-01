var mongoose = require("mongoose");

//Create the schema
var campgrpound_schema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    createdAt: { type: Date, default: Date.now },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },

    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]

});

//Create the model

module.exports = mongoose.model("Campground", campgrpound_schema);
