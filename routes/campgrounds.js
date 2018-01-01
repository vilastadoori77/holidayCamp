var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//Index route to show all campgrounds
router.get("/", function(req, res) {

    //all the campgrounds from db
    Campground.find({}, function(err, allcampgrounds) {

        if (err) {

            console.log("There is an error while finding the details");
        }
        else {

            res.render("campgrounds/index", { campgrounds: allcampgrounds, page: 'campgrounds' });
        }

    });

});

//Get the values from the form and add the values to the array.
//Add new campground to the database
router.post("/", middleware.isLoggedIn, function(req, res) {

    //get the name and url from the post form
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    //create and object
    var author = {
        id: req.user._id,
        username: req.user.username

    };
    var campgroundimage = { name: name, price: price, image: image, description: description, author: author };
    console.log(campgroundimage);

    //campgrounds.push(campgroundimage);
    Campground.create(campgroundimage, function(err, newlyCreated) {

        if (err) {
            console.log("Cannot be added into the database");
        }
        else {
            console.log(newlyCreated);
            req.flash("success", "Congragulations you have sucessfully created a campground");
            res.redirect("/campgrounds");
        }
    });
});

//Form to add the values of the campground.
//Show form to create the campground
router.get("/new", middleware.isLoggedIn, function(req, res) {

    res.render("campgrounds/posttest");

});


//Show route
router.get("/:id", function(req, res) {
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


//Edit campground Route

router.get("/:id/edit", middleware.checkCampGroundOwnerShip, function(req, res) {

    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            res.redirect("back");
        }
        else {
            res.render("campgrounds/edit", { campground: foundCampground });
        }
    });

});


//Update Campground Route

//update route
router.put("/:id", middleware.checkCampGroundOwnerShip, function(req, res) {
    //res.send("Reached the put request for the method override");
    //sanitize
    //req.body.campground.body = req.sanitize(req.body.campground.body);
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updateCampground) {

        if (err) {
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds");
        }
        else {
            req.flash("succss", "Campground successfully updated");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });

});


//Delete Camp Ground Route

router.delete("/:id", middleware.checkCampGroundOwnerShip, function(req, res) {

    Campground.findByIdAndRemove(req.params.id, function(err, deleteCampground) {

        if (err) {
            req.flash("error", "Campground you are trying to delete is not found");
            res.redirect("/campgrounds");
        }
        else {
            req.flash("succss", "Campground successfully deleted");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;
