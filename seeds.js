var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [{
        name: "Travellers Kit",
        image: "https://images.unsplash.com/photo-1493244040629-496f6d136cc4?auto=format&fit=crop&w=1464&q=80&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
        description: "This is the travellers kit"
    },
    {
        name: "Camping alone",
        image: "https://images.unsplash.com/photo-1507668339897-8a035aa9527d?auto=format&fit=crop&w=1402&q=80&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
        description: "Camping alone"
    },

    {
        name: "Starry Night",
        image: "https://images.unsplash.com/photo-1468956398224-6d6f66e22c35?auto=format&fit=crop&w=1510&q=80&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
        description: "Starry Night"
    }

];


function seedDB() {

    Campground.remove({}, function(err) {

        if (err) {
            console.log(err);
        }
        console.log("Removed from the database");
        //adding few campgrounds
        data.forEach(function(seed) {
            Campground.create(seed, function(err, campground) {

                if (err) {
                    console.log(err);
                }
                else {
                    console.log("added data for the campground");
                    //create a comment

                    Comment.create({
                        text: "This place is clean but wish had internet",
                        author: "Homer"
                    }, function(err, comment) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            campground.comments.push(comment);
                            campground.save();
                            console.log("Comments are created");
                        }


                    });

                }


            });
        });


    });


}


module.exports = seedDB;
