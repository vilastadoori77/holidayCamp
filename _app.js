var express = require("express"),
    app = express(),
    bodyparser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStratergy = require("passport-local"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");


mongoose.connect("mongodb://localhost/yelp_camp_v_6");
//Body Parser to get the values from the post route
app.use(bodyparser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));



/*Campground.create({
    name: "Mout abu",
    image: "http://www.photosforclass.com/download/8524305204",
    description: "This is mount abu and this is the great scenic space in the world"
}, function(err, campground) {

    if (err) {
        console.log("Could not create the camp gorund image");
    }
    else {
        console.log("Created the campgroundmodel below are the details");
        console.log(campground);
    }

});*/

//Static values will be replaced by DB
//Removes all the campgrounds
seedDB();

//Passport Configuration
app.use(require("express-session")({
    secret: "json is the best",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//use this middle ware so the current user can be avaialble across all the routes and can be used in the nav bar
app.use(function(req, res, next) {

    res.locals.currentUser = req.user;

    next();

});


passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/", function(req, res) {


    // res.send("This will be the landing page soon");
    res.render("landingpage");

});

//Sending the values to the campground
//index show all campgrounds
app.get("/campgrounds", function(req, res) {

    //all teh campgrounds from db
    Campground.find({}, function(err, allcampgrounds) {

        if (err) {

            console.log("There is an error while finding the details");
        }
        else {

            res.render("campgrounds/index", { campgrounds: allcampgrounds });
        }


    });
    // res.render("campgrounds", { campgrounds: campgrounds });

});

//Get the values from the form and add the values to the array.
//Add new campground to the database
app.post("/campgrounds", function(req, res) {

    //get the name and url from the post form
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    //create and object
    var campgroundimage = { name: name, image: image, description: description };
    console.log(campgroundimage);


    //campgrounds.push(campgroundimage);
    Campground.create(campgroundimage, function(err, newlyCreated) {

        if (err) {
            console.log("Cannot be added into the database");
        }
        else {
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});

//Form to add the values of the campground.
//Show form to create the campground
app.get("/campgrounds/new", function(req, res) {

    res.render("campgrounds/posttest");

});


//Show route
app.get("/campgrounds/:id", function(req, res) {
    //find the campground with provided ID
    //Campground.findById(req.params.id, function(err, foundCampground) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});


//Comments - New
// /campgrounds/:id/comments/new
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {

    Campground.findById(req.params.id, function(err, campground) {

        if (err) {
            console.log(err);
        }
        else {

            res.render("comments/new", { campground: campground });

        }


    });
    //res.send("This is comments form");



});

//Create new comment
// /campgrounds/:id/comments
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {

    Campground.findById(req.params.id, function(err, campground) {

        if (err) {

            console.log(err);
            res.redirect("/campgrounds");
        }
        else {

            Comment.create(req.body.comment, function(err, comment) {
                if (err) {

                    console.log(err);
                }
                else {

                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });

});

//Auth Routes

app.get("/register", function(req, res) {

    res.render("register");

});

//Will handle signup logic
app.post("/register", function(req, res) {


    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/campgrounds");
        });
    });
});


app.get("/login", function(req, res) {

    res.render("login");

});

//Route to authenticate login Handling route logic
app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res) {


});

//Logout route
app.get("/logout", function(req, res) {

    req.logout();
    res.redirect("/campgrounds");
});


//Writing the middle ware to check if the user is logged in.
function isLoggedIn(req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect("/login");
}

//Listening of the port.
app.listen(process.env.PORT, process.env.IP, function() {

    console.log("Yelp Camp Has Started");
});
