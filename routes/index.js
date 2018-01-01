var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


//Landing page Route
router.get("/", function(req, res) {


    // res.send("This will be the landing page soon");
    res.render("landingpage");

});


//Signup page route
router.get("/register", function(req, res) {

    res.render("register", { page: 'register' });

});

//Signup logic route
router.post("/register", function(req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("register", { error: err.message });
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to the Yelpcamp " + user.username);

            res.redirect("/campgrounds");
        });
    });
});

//login page route
router.get("/login", function(req, res) {

    res.render("login", { page: 'login' });

});

//Route to authenticate login Handling route logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res) {

    req.flash("success", "Login Sucessful!!!");
});

//Logout route
router.get("/logout", function(req, res) {

    req.logout();
    req.flash("success", "Logout Sucessful!!!");
    res.redirect("/campgrounds");
});





module.exports = router;
