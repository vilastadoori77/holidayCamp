var express = require("express"),
    app = express(),
    bodyparser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStratergy = require("passport-local"),
    //Campground = require("./models/campground"),
    //Comment = require("./models/comment"),
    methodOverride = require("method-override"),
    flash = require("connect-flash"),
    User = require("./models/user"),
    sanitizer = require("express-sanitizer"),
    seedDB = require("./seeds");

//requiring routes
var commRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");


//connecting to the mongodb V_10 database
//mongoose.connect("mongodb://localhost/yelp_camp_v_12");
mongoose.connect(process.env.DATABASEURL, function() {
    console.log("connected to the database");
});
//mongoose.connect("mongodb://vilas:suman@ds133657.mlab.com:33657/yelpcamp");
//mongodb://vilas:suman@ds133657.mlab.com:33657/yelpcamp
//Body Parser to get the values from the post route
app.use(methodOverride("_method"));
app.use(bodyparser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(sanitizer());
app.use(flash());


/*Campground.create({
    name: "Mout abu",
    image: "http://www.photosforclass.com/download/8524305204",
    description: "This is mount abu and this is the great scenic space in the world"
}, npm(err, campground) {

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
//seedDB();

app.locals.moment = require('moment');

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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();

});

//Passport to serialize and deserialize
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//Express Routes
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commRoutes);



//Listening of the port.
app.listen(process.env.PORT, process.env.IP, function() {

    console.log("Yelp Camp Has Started");
});
